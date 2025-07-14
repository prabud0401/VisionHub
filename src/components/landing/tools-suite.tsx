'use client';
import { Button } from "../ui/button";
import Image from "next/image";

export default function ToolsSuite() {
  return (
    <section id="services" className="py-20 bg-card/80 backdrop-blur-sm rounded-lg">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">Our AI Tools Suite</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
          Revolutionize your creative workflow with VisionHub's AI Tools Suite. This suite empowers you with cutting-edge AI technology.
        </p>
        
        <div className="relative w-full max-w-xl mx-auto aspect-video mb-8 rounded-lg overflow-hidden border-2 border-primary/50 shadow-lg shadow-primary/20">
          <Image
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigDbiBM6I5Fx1Jbz-hj_mqL_KtAPlv9UsQwpthZIfFLjL-hvCmst09I-RbQsbVt5Z0QzYI_Xj1l8vkS8JrP6eUlgK89GJzbb_P-BwLhVP13PalBm8ga1hbW5pVx8bswNWCjqZj2XxTFvwQ__u4ytDKvfFi5I2W9MDtH3wFXxww19EVYkN8IzIDJLh_aw/s1920/space-soldier-ai-wallpaper-4k.webp"
            alt="AI Generated Space Soldier"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
            data-ai-hint="space soldier"
          />
        </div>
        
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold font-headline mb-2">Text to Image</h3>
          <p className="text-lg text-primary mb-4">Character Consistency</p>
          <p className="text-muted-foreground mb-8">
            Maintain uniformity in your storytelling with Character Consistency, which ensures all generated images consistently reflect your characters.
          </p>
          <Button variant="accent">Start using Gemini</Button>
        </div>
      </div>
    </section>
  );
}
