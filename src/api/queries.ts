import { useQuery } from '@tanstack/react-query';
import { storyRequests } from './stories';
import { profileRequests } from './profile';

// Story Queries
export const useLibraryStories = (userId: string | null) => {
  return useQuery({
    queryKey: ['libraryStories', userId],
    queryFn: () => storyRequests.getLibrary(userId!),
    enabled: !!userId,
  });
};

export const useStory = (storyId: string | null) => {
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: () => storyRequests.getStory(storyId!),
    enabled: !!storyId,
  });
};

// Profile Queries
export const useProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileRequests.getProfile,
    enabled,
  });
};
