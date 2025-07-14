'use client';
import { Button } from "../ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const tools = [
  {
    title: "Text to Image",
    benefit: "Character Consistency",
    description: "Maintain uniformity in your storytelling, ensuring characters are consistently reflected in all generated images.",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigDbiBM6I5Fx1Jbz-hj_mqL_KtAPlv9UsQwpthZIfFLjL-hvCmst09I-RbQsbVt5Z0QzYI_Xj1l8vkS8JrP6eUlgK89GJzbb_P-BwLhVP13PalBm8ga1hbW5pVx8bswNWCjqZj2XxTFvwQ__u4ytDKvfFi5I2W9MDtH3wFXxww19EVYkN8IzIDJLh_aw/s1920/space-soldier-ai-wallpaper-4k.webp",
    imageHint: "space soldier",
  },
  {
    title: "Image to Image",
    benefit: "Style Transfer",
    description: "Transform your photos into works of art by applying the style of famous paintings or creating entirely new visual aesthetics.",
    image: "https://placehold.co/600x400.png",
    imageHint: "fantasy castle",
  },
  {
    title: "Prompt Enhancer",
    benefit: "Creative Assistance",
    description: "Our AI helps you write more descriptive and effective prompts to unlock the full potential of the image generation models.",
    image: "https://placehold.co/600x400.png",
    imageHint: "futuristic city",
  },
   {
    title: "Background Remover",
    benefit: "Instant Editing",
    description: "Automatically remove backgrounds from any image with a single click, perfect for product photos and portraits.",
    image: "https://placehold.co/600x400.png",
    imageHint: "portrait model",
  },
];

export default function ToolsSuite() {
  return (
    <section id="services" className="py-20 bg-card/80 backdrop-blur-sm rounded-lg">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">Our AI Tools Suite</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
          Revolutionize your creative workflow with VisionHub's AI Tools Suite. This suite empowers you with cutting-edge AI technology.
        </p>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {tools.map((tool, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="flex flex-col h-full">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
                        <Image
                          src={tool.image}
                          alt={tool.benefit}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint={tool.imageHint}
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-6 text-left flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold font-headline mb-2">{tool.title}</h3>
                        <p className="text-lg text-primary mb-4">{tool.benefit}</p>
                        <p className="text-muted-foreground mb-6 flex-grow">{tool.description}</p>
                        <Button variant="accent" className="mt-auto w-full">Learn More</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
