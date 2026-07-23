import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useProfile, useUpdateProfile } from '../../../api';
import type { ChildProfile } from '../../../types';

export const childProfileSchema = z.object({
  id: z.string(),
  nickname: z.string()
    .min(1, 'profile.nickname.required')
    .regex(/^[a-zA-Zא-ת\s]+$/, 'profile.nickname.invalid'),
  age: z.number().optional(),
  favoriteAnimal: z.string().optional(),
  hobby: z.string().regex(/^[a-zA-Zא-ת\s]*$/, 'profile.hobby.invalid').optional(),
});

export const profileSetupSchema = z.object({
  children: z.array(childProfileSchema).min(1, 'profile.minChildren')
}).superRefine((data, ctx) => {
  const nicknames = data.children.map(c => c.nickname.trim().toLowerCase());
  const seen = new Set<string>();
  
  nicknames.forEach((nickname, index) => {
    if (nickname && seen.has(nickname)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'profile.duplicateName', // This name already exists
        path: ['children', index, 'nickname']
      });
    }
    seen.add(nickname);
  });
});

export type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

export function useProfileSetup() {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const updateMutation = useUpdateProfile();
  
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
  const [savedChildIds, setSavedChildIds] = useState<Set<string>>(new Set());

  const form = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      children: [],
    },
    mode: 'onChange'
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'children',
    keyName: '_internalId' // avoid conflicting with our custom `id` field
  });

  // Hydrate form from backend
  useEffect(() => {
    if (profileData?.children) {
      const validChildren = profileData.children as ChildProfile[];
      replace(validChildren);
      setSavedChildIds(new Set(validChildren.map(c => c.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, isLoadingProfile]);

  const handleAddChild = () => {
    const newId = `child-${Date.now()}`;
    append({
      id: newId,
      nickname: '',
      age: 4,
      favoriteAnimal: 'dog',
      hobby: ''
    });
    setExpandedChildId(newId);
  };

  const handleSaveChild = async (index: number, childId: string) => {
    const isValid = await form.trigger(`children.${index}`);
    if (!isValid) return;

    const values = form.getValues();
    const payload = values.children
      .filter(c => savedChildIds.has(c.id) || c.id === childId)
      .map(c => ({
        ...c,
        id: c.id.startsWith('child-') ? null : c.id
      }));

    updateMutation.mutate({ children: payload }, {
      onSuccess: () => {
        setSavedChildIds(prev => new Set(prev).add(childId));
        setExpandedChildId(null);
      }
    });
  };

  const confirmDeleteChild = (index: number, childId: string) => {
    const isSaved = savedChildIds.has(childId);

    if (!isSaved) {
      remove(index);
      if (expandedChildId === childId) setExpandedChildId(null);
      setChildToDelete(null);
      return;
    }
    
    const values = form.getValues();
    const payload = values.children
      .filter(c => savedChildIds.has(c.id) && c.id !== childId)
      .map(c => ({
        ...c,
        id: c.id.startsWith('child-') ? null : c.id
      }));
    
    updateMutation.mutate({ children: payload }, {
      onSuccess: () => {
        remove(index);
        if (expandedChildId === childId) setExpandedChildId(null);
        setChildToDelete(null);
        setSavedChildIds(prev => {
          const newSaved = new Set(prev);
          newSaved.delete(childId);
          return newSaved;
        });
      }
    });
  };

  const handleDeleteProfile = () => {
    localStorage.setItem('user_id', 'null');
    window.dispatchEvent(new Event('auth_changed'));
    navigate('/');
  };

  return {
    form,
    fields,
    state: {
      expandedChildId,
      childToDelete,
      showDeleteProfileModal,
      savedChildIds,
      isLoadingProfile,
      isPending: updateMutation.isPending
    },
    actions: {
      setExpandedChildId,
      setChildToDelete,
      setShowDeleteProfileModal,
      handleAddChild,
      handleSaveChild,
      confirmDeleteChild,
      handleDeleteProfile,
      navigate
    }
  };
}
