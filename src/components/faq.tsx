
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What AI models can I use for image generation?',
    answer:
      "VisionHub AI integrates several state-of-the-art AI models, including models from Google (Gemini), OpenAI (DALL-E 3), and Stability AI (SDXL). You can select your preferred model from the dashboard to achieve different styles and results.",
  },
  {
    question: 'How does the background removal tool work?',
    answer:
      'Our background removal tool uses a sophisticated AI to identify the main subject in your photo and intelligently remove the background. This leaves you with a clean image with a transparent background, ready for any project.',
  },
    {
    question: 'What is AI Outpainting and Upscaling?',
    answer:
      "AI Outpainting allows you to expand an image beyond its original borders. Our AI analyzes the existing image and intelligently generates new content to fill the expanded space, matching the style and lighting. Upscaling increases the resolution of your image, making it sharper and more detailed.",
  },
  {
    question: 'Are my generated images private and secure?',
    answer:
      'Yes. When you log in, your generated images are linked to your account and stored securely in the cloud. Only you can access your gallery, ensuring your creations remain private unless you choose to share them.',
  },
  {
    question: 'Can I download the images I create?',
    answer:
      'Absolutely! All generated images, including those with backgrounds removed or upscaled, are available for high-resolution download directly from your gallery or immediately after generation.',
  },
  {
    question: 'Is there a limit to how many images I can generate?',
    answer:
      'Image generation is based on a credit system. Different subscription plans come with a different number of credits. This allows you to choose a plan that best fits your creative needs, from occasional use to large-scale projects.',
  },
  {
    question: 'What is a "Prompt Enhancer"?',
    answer:
      'The Prompt Enhancer is an AI-powered assistant that helps you write more detailed and effective prompts. A better prompt leads to a better image. It can suggest details, styles, and keywords to help you realize your vision more accurately.',
  },
];

export default function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem value={`item-${index + 1}`} key={index}>
          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
