'use client';
import { Button } from "../ui/button";

export default function ToolsSuite() {
  return (
    <section id="services" className="py-20 bg-card/80">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">Our AI Tools Suite</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
          Revolutionize your creative workflow with VisionHub's AI Tools Suite. This suite empowers you with cutting-edge AI technology.
        </p>
        
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="w-3 h-3 bg-accent rounded-full"></span>
          <span className="w-3 h-3 bg-muted rounded-full"></span>
          <span className="w-3 h-3 bg-muted rounded-full"></span>
        </div>
        
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold font-headline mb-2">Text to Image</h3>
          <p className="text-lg text-primary mb-4">Character Consistency</p>
          <p className="text-muted-foreground mb-8">
            Maintain uniformity in your storytelling with Character Consistency, which ensures all generated images consistently reflect your characters.
          </p>
          <Button variant="accent">Start using OpenAI</Button>
        </div>
      </div>
    </section>
  );
}
