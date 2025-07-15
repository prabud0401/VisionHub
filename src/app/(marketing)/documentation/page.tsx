
import { DocPageLayout } from "@/components/doc-page-layout";
import { Metadata } from 'next';
import { Code } from "lucide-react";

export const metadata: Metadata = {
  title: 'Documentation | VisionHub AI',
  description: 'Technical documentation for the VisionHub AI platform and API.',
};

const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'authentication', title: 'Authentication' },
    { id: 'api-endpoints', title: 'API Endpoints' },
];

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="my-4 p-4 bg-secondary rounded-md text-sm text-foreground/80 overflow-x-auto">
        <pre><code>{children}</code></pre>
    </div>
)

export default function DocumentationPage() {
    return (
        <DocPageLayout
            title="Developer Documentation"
            description="Integrate the power of VisionHub AI into your own applications with our robust API."
            sections={sections}
        >
            <section id="introduction">
                <h2>Introduction</h2>
                <p>Welcome to the VisionHub AI developer documentation. Our API provides direct access to our powerful suite of generative AI tools, allowing you to build your own applications and workflows on top of our platform. Whether you want to generate images, enhance prompts, or remove backgrounds programmatically, our RESTful API provides a simple and effective solution.</p>
                <p>This documentation will walk you through the necessary steps to get started, from authenticating your requests to using our various endpoints. We provide clear examples to help you integrate quickly and efficiently. If you have any questions, please don't hesitate to reach out to our support team.</p>
            </section>
            
            <section id="authentication">
                <h2>Authentication</h2>
                <p>All API requests to VisionHub AI must be authenticated using an API key. You can generate and manage your API keys from your account settings page. It is crucial to keep your API key secure and not expose it in any client-side code.</p>
                <p>To authenticate a request, include your API key in the `Authorization` header of your HTTP request, using the Bearer scheme.</p>
                <CodeBlock>
                    {`fetch('https://api.visionhub.ai/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ prompt: 'A futuristic cityscape' })
});`}
                </CodeBlock>
                <p>Requests made without a valid API key, or with an incorrect key, will result in a `401 Unauthorized` error.</p>
            </section>

            <section id="api-endpoints">
                <h2>API Endpoints</h2>
                <p>Our API is organized around REST principles. We offer several endpoints to interact with our services.</p>
                
                <h3 className="font-headline text-2xl mt-8 mb-2">POST /v1/generate</h3>
                <p>This is the primary endpoint for generating images from a text prompt. You can specify the model, aspect ratio, and other parameters in the request body.</p>
                <CodeBlock>
                    {`{
  "prompt": "A serene zen garden with a cherry blossom tree, digital art",
  "model": "Gemini AI",
  "aspectRatio": "16:9",
  "userId": "user_123"
}`}
                </CodeBlock>

                <h3 className="font-headline text-2xl mt-8 mb-2">POST /v1/enhance-prompt</h3>
                <p>This endpoint takes a simple prompt and uses our AI to enrich it with more descriptive details, improving the quality of generated images.</p>
                 <CodeBlock>
                    {`{
  "prompt": "A photo of a dog",
  "tones": ["cinematic", "dramatic"]
}`}
                </CodeBlock>

                 <h3 className="font-headline text-2xl mt-8 mb-2">POST /v1/remove-background</h3>
                <p>Submit an image as a data URI to this endpoint to receive a version with the background removed.</p>
                 <CodeBlock>
                    {`{
  "photoDataUri": "data:image/png;base64,iVBORw0KGgo..."
}`}
                </CodeBlock>
            </section>
        </DocPageLayout>
    );
}
