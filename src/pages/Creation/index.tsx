import { motion } from 'framer-motion';

import LoaderScreen from './components/LoaderScreen';
import Disclaimer from '../../components/Disclaimer';
import { Button } from '../../components/Button';

import { useCreation } from './hooks/useCreation';
import { CreationHeader } from './components/CreationHeader';
import { FastTrackSelector } from './components/FastTrackSelector';
import { ChildSelectorDropdown } from './components/ChildSelectorDropdown';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function CreationPage() {
  const { state, refs, actions } = useCreation();

  return (
    <>
      <LoaderScreen 
        isVisible={state.isPending} 
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="page-container h-full flex flex-1 flex-col p-6"
      >
        <CreationHeader isLoggedIn={state.isLoggedIn} />

        {/* Main Content */}
        <main className="flex flex-1 flex-col w-full min-h-0 space-y-[clamp(0.5rem,2dvh,1rem)] pb-2">
          
          <FastTrackSelector 
            selectedTrack={state.selectedTrack}
            setSelectedTrack={actions.setSelectedTrack}
            isDropdownOpen={state.isDropdownOpen}
            setIsDropdownOpen={actions.setIsDropdownOpen}
            dropdownRef={refs.dropdownRef}
          />

          {/* Divider */}
          <div className="flex items-center gap-[clamp(0.5rem,2dvh,1rem)] text-tzipur-brown/70 text-[clamp(0.875rem,2dvh,1rem)] shrink-0">
            <div className="flex-1 h-px bg-tzipur-border" />
            <span>{actions.t('creation.or')}</span>
            <div className="flex-1 h-px bg-tzipur-border" />
          </div>

          <div className="relative flex-1 min-h-0">
            <textarea
              placeholder={actions.t('creation.freeText')}
              value={state.freeText}
              onChange={(e) => actions.setFreeText(e.target.value)}
              disabled={!!state.selectedTrack}
              className="absolute inset-0 w-full h-full bg-white border border-tzipur-border rounded-2xl p-4 focus:outline-none focus:border-tzipur-sky focus:ring-1 focus:ring-tzipur-sky transition resize-none text-tzipur-brown placeholder:text-tzipur-brown/70/60 disabled:bg-tzipur-cream disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="pt-[clamp(0.5rem,2dvh,1rem)] pb-[clamp(0.25rem,1dvh,1rem)] mt-auto space-y-[clamp(0.5rem,1.5dvh,0.75rem)] shrink-0">
          
          {state.isLoggedIn && (
            <ChildSelectorDropdown
              childrenList={state.children}
              selectedChild={state.selectedChild}
              setSelectedChild={actions.setSelectedChild}
              isDropdownOpen={state.isChildDropdownOpen}
              setIsDropdownOpen={actions.setIsChildDropdownOpen}
              dropdownRef={refs.childDropdownRef}
            />
          )}

          <Button
            variant="primary"
            fullWidth
            onClick={actions.handleCreate}
            disabled={(!state.selectedTrack && !state.freeText.trim()) || state.isPending}
          >
            {actions.t('creation.submit')}
          </Button>

          <Disclaimer />
        </footer>
      </motion.div>
    </>
  );
}
