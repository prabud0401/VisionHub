
import { DocPageLayout } from "@/components/doc-page-layout";
import { Metadata } from 'next';
import Image from "next/image";

export const metadata: Metadata = {
  title: 'Tutorials | VisionHub AI',
  description: 'Step-by-step guides and tutorials for using VisionHub AI.',
};

const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'advanced-techniques', title: 'Advanced Techniques' },
    { id: 'workflow-integration', title: 'Workflow Integration' },
];

export default function TutorialsPage() {
    return (
        <DocPageLayout
            title="VisionHub AI Tutorials"
            description="Follow our step-by-step guides to master the tools and unlock your creative potential."
            sections={sections}
        >
            <section id="getting-started">
                <h2>Getting Started: Your First Image</h2>
                <p>Welcome to VisionHub AI! This tutorial will guide you through creating your very first AI-generated image. It's a simple process designed to get you up and running in minutes.</p>
                <ol className="list-decimal list-inside space-y-2 my-4">
                    <li><strong>Sign Up:</strong> If you haven't already, create an account to access the dashboard.</li>
                    <li><strong>Navigate to the Dashboard:</strong> This is your creative hub where all the magic happens.</li>
                    <li><strong>Write a Prompt:</strong> In the main text area, describe what you want to create. Let's start with something simple, like "A red sports car on a mountain road at sunset."</li>
                    <li><strong>Choose a Model:</strong> For your first image, the default "Gemini AI" is a great choice.</li>
                    <li><strong>Select an Aspect Ratio:</strong> "Landscape (16:9)" is perfect for our mountain road scene.</li>
                    <li><strong>Generate:</strong> Click the "Generate Images" button and watch the AI bring your vision to life! Your image will appear in the results panel.</li>
                </ol>
                <div className="relative w-full h-80 rounded-lg overflow-hidden my-8">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F76b739cd-ca34-4f74-96fe-b7ab3b3345f3.png?alt=media" alt="Dashboard UI" layout="fill" objectFit="cover" data-ai-hint="dashboard computer" />
                </div>
            </section>
            
            <section id="advanced-techniques">
                <h2>Advanced Techniques: Using the Prompt Enhancer</h2>
                <p>Ready to take your images to the next level? The Prompt Enhancer is your secret weapon. It uses AI to turn your simple ideas into rich, detailed prompts.</p>
                <p>Let's enhance our previous prompt. Type "A red sports car on a mountain road" into the prompt box. Now, instead of generating, click the "Enhance Prompt" button. The AI might suggest something like: "A gleaming cherry-red convertible sports car navigating a winding asphalt road high in the dramatic alpine mountains. The setting sun casts long shadows and bathes the scene in a warm, golden-hour glow, with lens flare reflecting off the car's polished surface. Cinematic, photorealistic."</p>
                <p>You can then accept this enhanced prompt and generate an image. The difference in detail and quality will be immediately apparent. This tool is perfect for when you have an idea but need help articulating the specific visual details to the AI.</p>
            </section>

            <section id="workflow-integration">
                <h2>Workflow Integration: Background Removal</h2>
                <p>VisionHub AI is more than just a generator; it's a suite of tools to perfect your creations. Let's say you've generated an amazing character but want to place them on a different background for a new project.</p>
                <ol className="list-decimal list-inside space-y-2 my-4">
                    <li><strong>Go to Your Gallery:</strong> Find the image you want to edit.</li>
                    <li><strong>Select "Upgrade":</strong> Click the magic wand icon on the image. This will take you to the Image Upgrade suite with your image pre-loaded.</li>
                    <li><strong>Remove Background:</strong> In the "Image Upgrade" tool, simply click the "Remove Background" button.</li>
                    <li><strong>Process and Download:</strong> The AI will process the image and present a version with a transparent background. You can then download this new image as a PNG file, ready to be used in any design software like Photoshop or Canva.</li>
                </ol>
                <p>This seamless workflow saves you time and effort, allowing you to move from concept to finished asset without ever leaving the VisionHub AI ecosystem.</p>
            </section>
        </DocPageLayout>
    );
}
