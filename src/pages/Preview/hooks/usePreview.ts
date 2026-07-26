import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStory, useEditStory } from '../../../api';
import { getUserId } from '../../../contexts/AuthContext';

export function usePreview() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const stateStory = location.state?.story;

  const { data: fetchedStory, isLoading: isFetching } = useStory(stateStory ? null : (storyId || null));
  const story = stateStory || fetchedStory;
  const isLoading = stateStory ? false : isFetching;
  const editMutation = useEditStory();

  const [editRequest, setEditRequest] = useState('');
  const [remainingEdits, setRemainingEdits] = useState(3);
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);
  const [isEditExpanded, setIsEditExpanded] = useState(false);

  const hasEdits = editRequest.trim().length > 0;

  const handleGenerateStory = () => {
    navigate(`/read/${storyId}`, { state: { story } });
  };

  const handleSendEdits = () => {
    if (!storyId || !editRequest.trim() || !story) return;
    
    const payload = {
      story_id: storyId,
      edit_request: editRequest,
      user_id: getUserId(),
    };

    editMutation.mutate(
      { storyId, data: payload },
      {
        onSuccess: () => {
          setEditRequest('');
          setRemainingEdits((prev) => Math.max(0, prev - 1));
        },
        onError: (e) => {
          console.error('Failed to regenerate story', e);
        }
      }
    );
  };

  return {
    state: {
      story,
      isLoading,
      editRequest,
      remainingEdits,
      isStoryExpanded,
      isEditExpanded,
      hasEdits,
      isPending: editMutation.isPending
    },
    actions: {
      t,
      setEditRequest,
      setIsStoryExpanded,
      setIsEditExpanded,
      handleGenerateStory,
      handleSendEdits
    }
  };
}
