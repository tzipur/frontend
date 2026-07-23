import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useLibraryStories, useProfile } from '../../../api';

export function useLibrary() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isLoggedIn, userId } = useAuth();
  
  const { data: stories = [], isLoading } = useLibraryStories(userId);
  const safeStories: any[] = Array.isArray(stories) ? stories : ((stories as any)?.stories || (stories as any)?.data || []);
  
  const { data: profileData } = useProfile(isLoggedIn);
  const children = profileData?.children || [];

  const [showGuestWarning, setShowGuestWarning] = useState(!isLoggedIn);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('library.dates.today');
    if (diffDays === 1) return t('library.dates.yesterday');
    if (diffDays < 7) return t('library.dates.daysAgo', { count: diffDays });

    const localeStr = i18n.language === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleDateString(localeStr, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function getChildNickname(childProfileId: string): string {
    const child = children.find((c) => c.id === childProfileId);
    return child?.nickname ?? t('library.defaultChild');
  }

  return {
    t,
    state: {
      safeStories,
      isLoading,
      showGuestWarning,
    },
    actions: {
      setShowGuestWarning,
      navigate,
      formatDate,
      getChildNickname
    }
  };
}
