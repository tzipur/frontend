import { Link } from 'react-router-dom';

import LoaderScreen from '../Creation/components/LoaderScreen';
import Disclaimer from '../../components/Disclaimer';
import { Button } from '../../components/Button';
import { ButtonGroup } from '../../components/ButtonGroup';

import { usePreview } from './hooks/usePreview';
import { PreviewHeader } from './components/PreviewHeader';
import { StoryViewer } from './components/StoryViewer';
import { EditStoryAccordion } from './components/EditStoryAccordion';

export default function PreviewPage() {
  const { state, actions } = usePreview();

  if (state.isLoading) {
    return (
      <LoaderScreen isVisible={true} mode="edit" />
    );
  }

  if (!state.story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center">
        <h1 className="font-serif text-2xl text-tzipur-brown mb-4">{actions.t('reading.notFound')}</h1>
        <Link to="/" className="text-tzipur-sky font-medium hover:underline">{actions.t('reading.backHome')}</Link>
      </div>
    );
  }

  return (
    <>
      <LoaderScreen
        isVisible={state.isPending}
        mode="edit"
      />

      <div className="absolute inset-0 flex flex-col bg-tzipur-cream overflow-hidden">
        
        <PreviewHeader />

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-2 relative z-0 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col gap-[clamp(0.75rem,2dvh,1rem)] min-h-0 overflow-hidden">
            
            <StoryViewer 
              story={state.story}
              isExpanded={state.isStoryExpanded}
              onToggle={() => actions.setIsStoryExpanded(!state.isStoryExpanded)}
            />

            <EditStoryAccordion
              editRequest={state.editRequest}
              setEditRequest={actions.setEditRequest}
              remainingEdits={state.remainingEdits}
              isExpanded={state.isEditExpanded}
              onToggle={() => actions.setIsEditExpanded(!state.isEditExpanded)}
            />

          </div>
        </main>

        <Disclaimer />

        {/* Footer Actions */}
        <footer className="shrink-0 w-full bg-white/80 backdrop-blur-md border-t border-tzipur-border p-[clamp(0.5rem,2dvh,1rem)] shadow-footer-lift z-20">
          <ButtonGroup>
            <Button
              variant="secondary"
              size="sm"
              onClick={actions.handleSendEdits}
              disabled={!state.hasEdits}
            >
              {actions.t('preview.sendEdits')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={actions.handleGenerateStory}
              disabled={state.hasEdits}
              title={state.hasEdits ? actions.t('preview.editBoxNotEmpty') : undefined}
            >
              {actions.t('preview.generate')}
            </Button>
          </ButtonGroup>
        </footer>
      </div>
    </>
  );
}
