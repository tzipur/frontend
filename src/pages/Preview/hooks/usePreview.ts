import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStory, useEditStory } from '../../../api';

export function usePreview() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: story, isLoading } = useStory(storyId || null);
  const editMutation = useEditStory();

  const [editRequest, setEditRequest] = useState('');
  const [remainingEdits, setRemainingEdits] = useState(3);
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);
  const [isEditExpanded, setIsEditExpanded] = useState(false);

  const hasEdits = editRequest.trim().length > 0;

  const handleGenerateStory = () => {
    navigate(`/read/${storyId}`);
  };

  const handleSendEdits = () => {
    if (!storyId || !editRequest.trim() || !story) return;
    
    const stitchedBody = (story.chapters || []).map((c: any) => c.text).join('\n\n');
    
    const payload = {
      story_title: story.title,
      story_body: stitchedBody,
      edit_instructions: editRequest,
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
