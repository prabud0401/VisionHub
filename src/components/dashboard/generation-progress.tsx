'use client';

import { memo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, Save, Sparkles } from 'lucide-react';

interface GenerationProgressProps {
  state: 'idle' | 'generating' | 'saving' | 'done';
}

const progressSteps = {
  idle: { progress: 0, title: '', description: '', icon: null },
  generating: { 
    progress: 33, 
    title: 'Generating Images', 
    description: 'AI is creating your masterpiece...', 
    icon: Sparkles 
  },
  saving: { 
    progress: 66, 
    title: 'Saving Results', 
    description: 'Storing your images securely...', 
    icon: Save 
  },
  done: { 
    progress: 100, 
    title: 'Complete!', 
    description: 'Your images are ready to view.', 
    icon: CheckCircle 
  },
} as const;

// Animated progress bar
const AnimatedProgress = memo(({ value }: { value: number }) => (
  <div className="relative">
    <Progress value={value} className="h-2" />
    <div 
      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-1000 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
));

AnimatedProgress.displayName = 'AnimatedProgress';

// Floating particles animation
const FloatingParticles = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
));

FloatingParticles.displayName = 'FloatingParticles';

export function GenerationProgress({ state }: GenerationProgressProps) {
  const isOpen = state !== 'idle';
  const step = progressSteps[state];
  const Icon = step.icon;

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="sm:max-w-md" 
        hideCloseButton
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative overflow-hidden">
          <FloatingParticles />
          
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative">
              {Icon && state !== 'generating' ? (
                <Icon className={`w-8 h-8 ${state === 'done' ? 'text-green-500' : 'text-primary'}`} />
              ) : (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              )}
              
              {/* Pulse animation for generating state */}
              {state === 'generating' && (
                <>
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse" />
                </>
              )}
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold">
                {step.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {step.description}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <AnimatedProgress value={step.progress} />
            
            <div className="flex justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                {step.progress}% Complete
              </span>
            </div>

            {/* Generation tips */}
            {state === 'generating' && (
              <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  💡 Tip: More detailed prompts usually produce better results
                </p>
              </div>
            )}

            {/* Success message */}
            {state === 'done' && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400 text-center font-medium">
                  🎉 Your AI-generated images are ready!
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Custom CSS for floating animation (add to globals.css)
export const floatingKeyframes = `
@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.8;
  }
  90% {
    opacity: 1;
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
`; 