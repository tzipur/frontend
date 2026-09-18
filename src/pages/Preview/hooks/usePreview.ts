import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStory, useEditStory } from '../../../api';
import { getUserId } from '../../../contexts/AuthContext';
import type { ValidationAlert } from '../../Creation/components/SafetyAlertModal';

export function usePreview() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const stateStory = location.state?.story;

  const { data: fetchedStory, isLoading: isFetching } = useStory(stateStory ? null : (storyId || null));
  // The latest edit response wins over the story we arrived with.
  const [editedStory, setEditedStory] = useState<any>(null);
  const story = editedStory || stateStory || fetchedStory;
  const isLoading = stateStory ? false : isFetching;
  const editMutation = useEditStory();

  // The server owns the edit budget: it arrives on the story (generate, edit,
  // GET) and on the edit refusals (safety block, no edits left).
  const [refusedEditsLeft, setRefusedEditsLeft] = useState<number | null>(null);
  const editsLeft: number = refusedEditsLeft ?? story?.edits_left ?? 0;
  const canEdit = editsLeft > 0;

  // A safety gate refused the edit: its crisis referral has to reach the parent.
  const [safetyAlertData, setSafetyAlertData] = useState<ValidationAlert | null>(null);

  const [editRequest, setEditRequest] = useState('');
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);
  const [isEditExpanded, setIsEditExpanded] = useState(false);

  const hasEdits = editRequest.trim().length > 0;

  const handleGenerateStory = () => {
    navigate(`/read/${storyId}`, { state: { story } });
  };

  const handleSendEdits = () => {
    if (!storyId || !editRequest.trim() || !story || !canEdit) return;

    const payload = {
      edit_request: editRequest,
      user_id: getUserId(),
    };

    editMutation.mutate(
      { storyId, data: payload },
      {
        onSuccess: (data) => {
          setEditRequest('');
          setEditedStory(data?.story || data);
          setRefusedEditsLeft(null);
        },
        onError: (e: any) => {
          console.error('Failed to regenerate story', e);
          const errorData = e?.response?.data;
          if (errorData?.status === 'blocked' && errorData?.safety_alert) {
            setSafetyAlertData(errorData.validation);
          }
          const editsLeftOnRefusal = errorData?.edits_left;
          if (typeof editsLeftOnRefusal === 'number') {
            setRefusedEditsLeft(editsLeftOnRefusal);
          }
        }
      }
    );
  };

  return {
    state: {
      story,
      isLoading,
      editRequest,
      editsLeft,
      canEdit,
      isStoryExpanded,
      isEditExpanded,
      hasEdits,
      safetyAlertData,
      isPending: editMutation.isPending
    },
    actions: {
      t,
      setEditRequest,
      setSafetyAlertData,
      setIsStoryExpanded,
      setIsEditExpanded,
      handleGenerateStory,
      handleSendEdits
    }
  };
}
