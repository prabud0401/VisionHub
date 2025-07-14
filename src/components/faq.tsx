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
      "VisionHub AI integrates several state-of-the-art AI models, including OpenAI's DALL-E 3, Stability AI's SDXL, and DeepAI's Image Generation model. You can select your preferred model before generating an image.",
  },
  {
    question: 'How does the background removal tool work?',
    answer:
      'Our background removal tool uses a sophisticated AI model to identify the foreground subject in your photo and intelligently remove the background, leaving you with a clean image with a transparent background.',
  },
  {
    question: 'Are my generated images private?',
    answer:
      'Yes, your generated images are stored locally in your browser. They are not uploaded to our servers or shared with anyone else, ensuring your creations remain private.',
  },
  {
    question: 'Can I download the images I create?',
    answer:
      'Absolutely! All generated images, including those with backgrounds removed, are available for download in high quality directly from your gallery or right after generation.',
  },
  {
    question: 'Is there a limit to how many images I can generate?',
    answer:
      'Currently, in this demonstration version of the app, there are no set limits on image generation. Feel free to explore and create as much as you like!',
  },
];

export default function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem value={`item-${index + 1}`} key={index}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
