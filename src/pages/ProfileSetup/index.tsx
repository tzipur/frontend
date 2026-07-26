import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { useProfileSetup } from './hooks/useProfileSetup';
import { ProfileHeader } from './components/ProfileHeader';
import { ChildFormAccordion } from './components/ChildFormAccordion';
import { DeleteModals } from './components/DeleteModals';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function ProfileSetupPage() {
  const { t } = useTranslation();
  
  const {
    form,
    fields,
    state,
    actions
  } = useProfileSetup();

  const isFormValid = form.formState.isValid;

  const handleLogOut = () => {
    sessionStorage.removeItem('active_user_id');
    window.dispatchEvent(new Event('auth_changed'));
    actions.navigate('/login');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col p-6"
    >
      <ProfileHeader 
        onDeleteProfileClick={() => actions.setShowDeleteProfileModal(true)} 
        onLogOutClick={handleLogOut}
      />

      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-4">
        <div className="space-y-[clamp(0.5rem,2dvh,1rem)]">
          {fields.map((field, index) => (
            <ChildFormAccordion
              key={field._internalId}
              index={index}
              childId={field.id}
              isExpanded={!state.savedChildIds.has(field.id) || state.expandedChildId === field.id}
              isSaved={state.savedChildIds.has(field.id)}
              form={form}
              onToggleExpand={() => actions.setExpandedChildId(state.expandedChildId === field.id ? null : field.id)}
              onSave={() => actions.handleSaveChild(index, field.id)}
              onDeleteRequest={() => actions.setChildToDelete(field.id)}
              onCancelDelete={() => {
                if (!state.savedChildIds.has(field.id)) {
                  actions.confirmDeleteChild(index, field.id);
                } else {
                  actions.setExpandedChildId(null);
                }
              }}
            />
          ))}

          <button
            onClick={actions.handleAddChild}
            className="w-full bg-transparent border-2 border-dashed border-tzipur-sky/30 hover:border-tzipur-sky/60 hover:bg-tzipur-sky/5 rounded-[32px] p-[clamp(1rem,3dvh,1.5rem)] flex flex-col items-center justify-center gap-[clamp(0.5rem,1.5dvh,0.75rem)] text-tzipur-sky font-bold transition-all duration-300 mt-[clamp(0.75rem,2dvh,1.5rem)]"
          >
            <Plus size={32} strokeWidth={2} className="transition-colors duration-300" />
            {t('profile.addChild')}
          </button>
        </div>
      </main>

      <footer className="pt-[clamp(0.75rem,2dvh,1.5rem)] pb-2 mt-auto shrink-0 z-10 flex flex-col gap-[clamp(0.5rem,1.5dvh,0.75rem)]">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={() => actions.navigate('/create')} 
          disabled={!isFormValid || state.isPending}
        >
          {state.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('profile.startCreating')}
        </Button>
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => actions.navigate('/library')} 
          disabled={state.isPending}
        >
          {t('profile.goToLibrary')}
        </Button>
      </footer>

      <DeleteModals
        showProfileModal={state.showDeleteProfileModal}
        onCancelProfileModal={() => actions.setShowDeleteProfileModal(false)}
        onConfirmProfileModal={actions.handleDeleteProfile}
        childToDeleteId={state.childToDelete}
        onCancelChildModal={() => actions.setChildToDelete(null)}
        onConfirmChildModal={() => {
          if (state.childToDelete) {
            const index = fields.findIndex(f => f.id === state.childToDelete);
            if (index !== -1) {
              actions.confirmDeleteChild(index, state.childToDelete);
            }
          }
        }}
      />
    </motion.div>
  );
}
