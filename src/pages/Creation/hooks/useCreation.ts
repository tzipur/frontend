import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile, useGenerateStory } from '../../../api';
import type { ValidationAlert } from '../components/SafetyAlertModal';

export function useCreation() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isLoggedIn, userId } = useAuth();

    const { data: profileData } = useProfile(isLoggedIn);
    const children = profileData?.children || [];

    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [freeText, setFreeText] = useState('');
    const [selectedChild, setSelectedChild] = useState<string>('');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
    const childDropdownRef = useRef<HTMLDivElement>(null);

    const [safetyAlertData, setSafetyAlertData] = useState<ValidationAlert | null>(null);

    const generateMutation = useGenerateStory();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (childDropdownRef.current && !childDropdownRef.current.contains(event.target as Node)) {
                setIsChildDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreate = async () => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            try {
                await Notification.requestPermission();
            } catch (e) {
                console.warn("Notification permission error", e);
            }
        }

        const payload = {
            user_id: userId || null,
            story_brief: {
                selected_tags: selectedTrack ? [selectedTrack] : [],
                incident_description: freeText || null,
                created_for: selectedChild || null,
            }
        };

        generateMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data?.status === 'blocked' && data?.safety_alert) {
                    setSafetyAlertData(data.validation);
                    return;
                }

                if (!userId && data?.user?.user_id) {
                    const newUserId = data.user.user_id;
                    localStorage.setItem('user_id', newUserId);
                    if (sessionStorage.getItem('guest_mode') === 'true') {
                        sessionStorage.setItem('guest_user_id', newUserId);
                    } else {
                        sessionStorage.setItem('active_user_id', newUserId);
                    }
                    window.dispatchEvent(new Event('auth_changed'));
                }

                const story = data?.story || data;
                const newStoryId = story?.id || story?.story_id || 'story-001';
                navigate(`/preview/${newStoryId}`, { state: { story } });

                if ('Notification' in window && Notification.permission === 'granted' && document.visibilityState === 'hidden') {
                    const notif = new Notification(t('creation.loader.notificationBody') || t('creation.loader.notification'));
                    notif.onclick = () => {
                        window.focus();
                        notif.close();
                    };
                }
            },
            onError: (err: any) => {
                console.error("Story generation failed", err);
                const errorData = err?.response?.data;
                if (errorData?.status === 'blocked' && errorData?.safety_alert) {
                    setSafetyAlertData(errorData.validation);
                }
            }
        });
    };

    return {
        state: {
            isLoggedIn,
            children,
            selectedTrack,
            freeText,
            selectedChild,
            isDropdownOpen,
            isChildDropdownOpen,
            isPending: generateMutation.isPending,
            safetyAlertData
        },
        refs: {
            dropdownRef,
            childDropdownRef
        },
        actions: {
            t,
            setSelectedTrack,
            setFreeText,
            setSelectedChild,
            setIsDropdownOpen,
            setIsChildDropdownOpen,
            handleCreate,
            setSafetyAlertData
        }
    };
}
