'use client';

import { Check, Loader2, Save, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ProgressState = 'idle' | 'generating' | 'saving' | 'done';

interface GenerationProgressModalProps {
  state: ProgressState;
}

const progressInfo = {
  generating: {
    icon: <Wand2 className="h-8 w-8 text-primary" />,
    title: 'Generating Image...',
    description: 'Our AI is bringing your prompt to life. This may take a moment.',
  },
  saving: {
    icon: <Save className="h-8 w-8 text-primary" />,
    title: 'Saving Your Creation...',
    description: 'Adding your new masterpiece to your gallery.',
  },
  done: {
    icon: <Check className="h-8 w-8 text-green-500" />,
    title: 'Done!',
    description: 'Your image has been generated and saved.',
  },
};

export function GenerationProgressModal({ state }: GenerationProgressModalProps) {
  const isOpen = state !== 'idle';
  const currentProgress = progressInfo[state as keyof typeof progressInfo];

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="items-center text-center">
          <div className="mb-4">
            {state === 'done' ? (
                currentProgress.icon
            ) : (
                <div className="relative">
                    {currentProgress?.icon}
                    <Loader2 className="h-14 w-14 absolute -top-3 -left-3 text-primary/50 animate-spin" />
                </div>
            )}
          </div>
          <DialogTitle className="text-2xl font-headline">{currentProgress?.title}</DialogTitle>
          <p className="text-muted-foreground">{currentProgress?.description}</p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// Add hideCloseButton prop to DialogContent
declare module '@radix-ui/react-dialog' {
    interface DialogContentProps {
        hideCloseButton?: boolean;
    }
}
