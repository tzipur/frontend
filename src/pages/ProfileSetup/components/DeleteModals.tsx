import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { ButtonGroup } from '../../../components/ButtonGroup';

interface DeleteModalsProps {
  showProfileModal: boolean;
  onCancelProfileModal: () => void;
  onConfirmProfileModal: () => void;

  childToDeleteId: string | null;
  onCancelChildModal: () => void;
  onConfirmChildModal: () => void;
}

export function DeleteModals({
  showProfileModal,
  onCancelProfileModal,
  onConfirmProfileModal,
  childToDeleteId,
  onCancelChildModal,
  onConfirmChildModal,
}: DeleteModalsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Delete Profile Confirmation Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-tzipur-brown/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-tzipur-surface w-full max-w-sm rounded-[32px] p-6 shadow-xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-tzipur-error-bg rounded-full flex items-center justify-center mx-auto mb-4 text-tzipur-error">
                  <Trash2 size={28} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl text-tzipur-brown">{t('profile.deleteProfileConfirmTitle', 'מחיקת פרופיל')}</h3>
                <p className="text-tzipur-brown/70 leading-relaxed font-medium">
                  {t('profile.deleteProfileConfirm', 'האם אתה בטוח שברצונך למחוק את הפרופיל?')}
                </p>
              </div>
              <ButtonGroup>
                <Button variant="secondary" onClick={onCancelProfileModal}>
                  {t('profile.cancel')}
                </Button>
                <Button variant="destructive" onClick={onConfirmProfileModal}>
                  {t('profile.confirmDelete')}
                </Button>
              </ButtonGroup>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Child Confirmation Modal */}
      <AnimatePresence>
        {childToDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-tzipur-brown/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-tzipur-surface w-full max-w-sm rounded-[32px] p-6 shadow-xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-tzipur-error-bg rounded-full flex items-center justify-center mx-auto mb-4 text-tzipur-error">
                  <Trash2 size={28} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl text-tzipur-brown">{t('profile.deleteConfirmTitle')}</h3>
                <p className="text-tzipur-brown/70 leading-relaxed font-medium">
                  {t('profile.deleteConfirmMessage')}
                </p>
              </div>
              <ButtonGroup>
                <Button variant="secondary" onClick={onCancelChildModal}>
                  {t('profile.cancel')}
                </Button>
                <Button variant="destructive" onClick={onConfirmChildModal}>
                  {t('profile.confirmDelete')}
                </Button>
              </ButtonGroup>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
