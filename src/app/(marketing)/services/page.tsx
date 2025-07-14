
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services | VisionHub AI',
  description: 'Explore our powerful suite of AI tools for image generation and editing.',
};

const services = [
  {
    title: "Text-to-Image Generation",
    description: "Bring your most ambitious ideas to life. Describe any scene, character, or concept, and watch as our AI generates stunning, high-resolution images from your text prompts. Perfect for artists, designers, and marketers.",
    features: ["Multiple AI Models (Gemini, DALL-E 3, etc.)", "Custom Aspect Ratios", "Stylistic Tone Control", "Character Consistency"],
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigDbiBM6I5Fx1Jbz-hj_mqL_KtAPlv9UsQwpthZIfFLjL-hvCmst09I-RbQsbVt5Z0QzYI_Xj1l8vkS8JrP6eUlgK89GJzbb_P-BwLhVP13PalBm8ga1hbW5pVx8bswNWCjqZj2XxTFvwQ__u4ytDKvfFi5I2W9MDtH3wFXxww19EVYkN8IzIDJLh_aw/s1920/space-soldier-ai-wallpaper-4k.webp",
    imageHint: "space soldier future",
  },
  {
    title: "AI Image Upgrade Suite",
    description: "Refine and perfect your images with our advanced editing tools. Whether you need to isolate a subject, expand a scene, or improve quality, our AI-powered suite makes complex editing tasks effortless.",
    features: ["One-Click Background Removal", "AI Outpainting & Upscaling", "Resize to Any Aspect Ratio", "Preserves Image Quality"],
    image: "https://storage.googleapis.com/visionhub-ai-s813r.appspot.com/generated-images/9b6b8014-9b2f-4886-a7a5-3645b31e9c2f.png",
    imageHint: "woman portrait clean",
  },
  {
    title: "Prompt Enhancer",
    description: "Unlock the full potential of generative AI with better prompts. Our intelligent Prompt Enhancer analyzes your initial idea and enriches it with descriptive details, styles, and keywords for more accurate and creative results.",
    features: ["AI-Powered Suggestions", "Visual & Stylistic Enrichment", "Learn Prompt Engineering", "Integrated with Generator"],
    image: "https://cdn.web.imagine.art/imagine-frontend/assets/images/64f15f69-7253-46a4-966a-7434311855e9.jpeg",
    imageHint: "futuristic city bright",
  },
  {
    title: "Image-to-Prompt Analysis",
    description: "Ever wonder what prompt could create a specific image? Upload any picture, and our AI will reverse-engineer it, generating a detailed text prompt that captures its essence, style, and composition.",
    features: ["Deconstruct Any Image Style", "Inspiration for New Creations", "Learn from Existing Art", "Copy & Paste to Generate"],
    image: "https://cdn.web.imagine.art/imagine-frontend/assets/images/03b13735-a7b7-4e3c-a99f-0746654497a7.jpeg",
    imageHint: "fantasy castle landscape",
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          A Powerful Suite of AI Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          From ideation to final edits, VisionHub provides all the tools you need to streamline your creative workflow and produce exceptional results.
        </p>
      </div>

      <div className="space-y-24">
        {services.map((service, index) => (
          <Card key={service.title} className="overflow-hidden border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center`}>
                <div className={`relative w-full h-96 rounded-lg overflow-hidden shadow-xl ${index % 2 === 0 ? 'md:order-2' : ''}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={service.imageHint}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
