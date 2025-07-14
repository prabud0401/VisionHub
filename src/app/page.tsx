import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Faq from '@/components/faq';
import { ArrowRight, BotMessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      <div className="w-full flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create Stunning Visuals with VisionHub AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Harness the power of multiple leading AI models to generate unique images from text prompts, remove backgrounds, and bring your creative ideas to life.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Start Creating
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
               <div className="hidden lg:flex items-center justify-center">
                 <BotMessageSquare className="h-64 w-64 text-primary/30" strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? We've got answers. Here are some of the most common questions we get.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              <Faq />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
