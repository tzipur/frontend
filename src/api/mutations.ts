import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authRequests, type AuthRequest } from './auth';
import { storyRequests, type GenerateStoryPayload, type EditStoryPayload } from './stories';
import { profileRequests, type ProfileData } from './profile';

// Auth Mutations
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: AuthRequest) => authRequests.login(data),
    meta: { errorMessage: 'auth.loginError' },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: AuthRequest) => authRequests.register(data),
    meta: { errorMessage: 'auth.registerError' },
  });
};

// Story Mutations
export const useGenerateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateStoryPayload) => storyRequests.generateStory(data),
    meta: { errorMessage: 'creation.generateError' },
    onSuccess: () => {
      // Invalidate library queries to refetch after generation
      queryClient.invalidateQueries({ queryKey: ['libraryStories'] });
    },
  });
};

export const useEditStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storyId, data }: { storyId: string; data: EditStoryPayload }) =>
      storyRequests.editStory({ storyId, data }),
    meta: { errorMessage: 'preview.editError' },
    onSuccess: (_, variables) => {
      // Invalidate the specific story query after edit
      queryClient.invalidateQueries({ queryKey: ['story', variables.storyId] });
      queryClient.invalidateQueries({ queryKey: ['libraryStories'] });
    },
  });
};

export const useSaveStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storyId: string) => storyRequests.saveStory(storyId),
    meta: { errorMessage: 'reading.saveError' },
    onSuccess: () => {
      // Invalidate library queries to fetch the saved story
      queryClient.invalidateQueries({ queryKey: ['libraryStories'] });
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storyId: string) => storyRequests.deleteStory(storyId),
    meta: { errorMessage: 'library.deleteError' },
    onSuccess: () => {
      // Invalidate library queries to reflect deletion
      queryClient.invalidateQueries({ queryKey: ['libraryStories'] });
    },
  });
};

// Profile Mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileData) => profileRequests.updateProfile(data),
    meta: { errorMessage: 'profile.updateError' },
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
