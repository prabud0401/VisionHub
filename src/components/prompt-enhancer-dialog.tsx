'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, WandSparkles } from 'lucide-react';
import { Diff, diffChars } from 'diff';

interface PromptEnhancerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  originalPrompt: string;
  enhancedPrompt: string;
  onAccept: (newPrompt: string) => void;
}

const DiffView = ({ original, enhanced }: { original: string; enhanced: string }) => {
  const differences = diffChars(original, enhanced);
  return (
    <p className="leading-relaxed">
      {differences.map((part, index) => {
        const style = part.added
          ? 'bg-green-500/20 text-green-300 font-medium rounded'
          : part.removed
          ? 'bg-red-500/20 text-red-400 line-through rounded'
          : 'text-muted-foreground';
        return (
          <span key={index} className={style}>
            {part.value}
          </span>
        );
      })}
    </p>
  );
};


export function PromptEnhancerDialog({
  isOpen,
  onOpenChange,
  originalPrompt,
  enhancedPrompt,
  onAccept,
}: PromptEnhancerDialogProps) {
  
  const handleAccept = () => {
    onAccept(enhancedPrompt);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WandSparkles className="h-6 w-6 text-primary" />
            Prompt Enhanced
          </DialogTitle>
          <DialogDescription>
            Our AI agent has enhanced your prompt. Review the changes below.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-4">
            <div className="space-y-2">
                <h3 className="font-semibold">Original Prompt</h3>
                <p className="text-muted-foreground p-4 bg-secondary rounded-md">{originalPrompt}</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Enhanced Version</h3>
                 <div className="p-4 bg-card rounded-md border">
                    <DiffView original={originalPrompt} enhanced={enhancedPrompt} />
                 </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAccept}>
            Use Enhanced Prompt <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
