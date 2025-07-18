
import { DocPageLayout } from "@/components/doc-page-layout";
import { Metadata } from 'next';
import Image from "next/image";

export const metadata: Metadata = {
  title: 'Blog | VisionHub AI',
  description: 'Latest news, tutorials, and insights from the VisionHub AI team.',
};

const sections = [
    { id: 'announcing-v1', title: 'Announcing VisionHub AI v1.0' },
    { id: 'prompt-engineering-guide', title: 'A Guide to Prompt Engineering' },
    { id: 'future-of-ai', title: 'The Future of Generative AI' },
];

export default function BlogPage() {
    return (
        <DocPageLayout
            title="VisionHub AI Blog"
            description="Latest news, tutorials, and insights from the VisionHub AI team."
            sections={sections}
        >
            <section id="announcing-v1">
                <div className="relative w-full h-80 rounded-lg overflow-hidden my-8">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F6d29a9de-8324-4835-982c-03e7c729d641.png?alt=media" alt="Abstract AI art" layout="fill" objectFit="cover" data-ai-hint="abstract technology" />
                </div>
                <h2>Announcing VisionHub AI v1.0</h2>
                <p className="text-sm text-muted-foreground mb-4">Posted on {new Date().toLocaleDateString()}</p>
                <p>We are thrilled to announce the official launch of VisionHub AI v1.0! After months of development and refinement, our comprehensive suite of AI-powered creative tools is now available to the public. VisionHub AI is designed to democratize creativity, offering powerful yet intuitive tools for text-to-image generation, image editing, prompt enhancement, and much more. Our mission is to empower artists, designers, marketers, and hobbyists to bring their visions to life without the steep learning curve of traditional software.</p>
                <p>This release includes access to multiple state-of-the-art AI models, including Gemini, DALL-E 3, and Stable Diffusion, all under one unified interface. The platform also features our unique AI Upgrade Suite, allowing for one-click background removal and intelligent image outpainting/upscaling. We believe these tools will unlock new possibilities and streamline creative workflows for everyone. We can't wait to see what you create!</p>
            </section>
            
            <section id="prompt-engineering-guide">
                <div className="relative w-full h-80 rounded-lg overflow-hidden my-8">
                     <Image src="https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2Fbc9bc6be-11b4-4125-bb38-668b9539b00c.png?alt=media" alt="AI prompt creation" layout="fill" objectFit="cover" data-ai-hint="code terminal" />
                </div>
                <h2>A Beginner's Guide to Prompt Engineering</h2>
                <p className="text-sm text-muted-foreground mb-4">Posted on {new Date(Date.now() - 86400000 * 3).toLocaleDateString()}</p>
                <p>Generative AI is powerful, but the quality of your output often depends on the quality of your input. This is where prompt engineering comes in. A "prompt" is the instruction you give the AI, and crafting a good one is both an art and a science. The key is to be specific, descriptive, and clear. Instead of "a cat," try "a photorealistic portrait of a fluffy calico cat sleeping in a sunbeam, with soft lighting and a shallow depth of field."</p>
                <p>Think about including details about the subject, the style (e.g., "digital painting," "cinematic," "anime"), the composition ("close-up," "wide shot"), and the lighting ("dramatic lighting," "golden hour"). Our integrated Prompt Enhancer tool is designed to help you with this, taking your basic ideas and enriching them with the kind of detail that yields stunning results. Experimentation is key, so don't be afraid to try different combinations and see what works best.</p>
            </section>

            <section id="future-of-ai">
                <div className="relative w-full h-80 rounded-lg overflow-hidden my-8">
                     <Image src="https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2Fbf6ab35f-9f35-4c21-a6e7-8dd307a5c82b.png?alt=media" alt="Futuristic city" layout="fill" objectFit="cover" data-ai-hint="futuristic city" />
                </div>
                <h2>The Future of Generative AI</h2>
                <p className="text-sm text-muted-foreground mb-4">Posted on {new Date(Date.now() - 86400000 * 7).toLocaleDateString()}</p>
                <p>The field of generative AI is evolving at an astonishing pace. What was science fiction just a few years ago is now a reality on platforms like VisionHub AI. Looking ahead, we anticipate even more groundbreaking advancements. AI models will become more coherent, better at understanding context, and capable of generating not just images, but complex 3D models, interactive environments, and feature-length videos from simple text prompts.</p>
                <p>At VisionHub AI, we are committed to staying at the forefront of this revolution. Our roadmap includes the development of AI video generation, inpainting/outpainting tools, and a collaborative community showcase. We envision a future where AI acts as a true creative partner, augmenting human ingenuity and allowing for unprecedented levels of artistic expression. The line between human and machine creation will continue to blur, opening up new worlds of possibility for creators everywhere.</p>
            </section>
        </DocPageLayout>
    );
}
