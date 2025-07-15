
import { DocPageLayout } from "@/components/doc-page-layout";
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Get API Access | VisionHub AI',
  description: 'Get API access to integrate VisionHub AI into your applications.',
};

const sections = [
    { id: 'why-use-api', title: 'Why Use the API?' },
    { id: 'pricing-plans', title: 'Pricing & Plans' },
    { id: 'get-started', title: 'How to Get Started' },
];

export default function GetApiPage() {
    return (
        <DocPageLayout
            title="Get API Access"
            description="Unlock the full potential of VisionHub AI by integrating our powerful tools directly into your own applications and services."
            sections={sections}
        >
            <section id="why-use-api">
                <h2>Why Use the VisionHub AI API?</h2>
                <p>While our web dashboard provides an intuitive interface for creating and managing AI-generated images, our API offers a new level of flexibility and power for developers. By integrating our API, you can automate content creation, build custom internal tools, or even create your own public-facing applications powered by our generative models.</p>
                <ul className="list-disc list-inside space-y-2 my-4">
                    <li><strong>Automation:</strong> Programmatically generate thousands of images for e-commerce, marketing campaigns, or game assets.</li>
                    <li><strong>Integration:</strong> Seamlessly embed AI image generation into your existing content management systems, design tools, or social media schedulers.</li>
                    <li><strong>Custom Experiences:</strong> Build unique applications for niche markets, offering AI-powered features to your own users.</li>
                    <li><strong>Scalability:</strong> Our API is built to handle high volumes of requests, ensuring reliable performance as your needs grow.</li>
                </ul>
            </section>
            
            <section id="pricing-plans">
                <h2>API Pricing & Plans</h2>
                <p>API access is included exclusively with our **Premium** subscription plan. This plan is designed for power users, agencies, and businesses that require high-volume generation and programmatic access. It provides a generous number of monthly credits that can be used for both dashboard generation and API calls.</p>
                <p>The Premium plan offers the most cost-effective rate per image for high-volume users and ensures you have the resources you need to scale your projects. For custom enterprise solutions or significantly higher volume needs, please contact our sales team to discuss a tailored plan.</p>
                <Button asChild size="lg" className="mt-4">
                    <Link href="/pricing">View Pricing Plans</Link>
                </Button>
            </section>

            <section id="get-started">
                <h2>How to Get Started with the API</h2>
                <p>Getting started with the VisionHub AI API is a straightforward process:</p>
                 <ol className="list-decimal list-inside space-y-2 my-4">
                    <li><strong>Subscribe to Premium:</strong> First, ensure you are subscribed to our Premium plan. You can upgrade your account from the pricing page.</li>
                    <li><strong>Generate Your API Key:</strong> Once subscribed, navigate to your "Creator Hub" (Settings). You will find a new section for API Key Management. Generate your first key here. Remember to store it securely!</li>
                    <li><strong>Read the Documentation:</strong> Head over to our comprehensive developer documentation to understand the available endpoints, request parameters, and response formats.</li>
                    <li><strong>Make Your First Call:</strong> Use your favorite programming language or tool (like cURL or Postman) to make your first API call to the `/v1/generate` endpoint using your new API key.</li>
                    <li><strong>Build Something Amazing:</strong> You're all set! Start integrating and building your next amazing project with the power of VisionHub AI.</li>
                </ol>
                 <Button asChild variant="outline" size="lg" className="mt-4">
                    <Link href="/documentation">Read the Docs</Link>
                </Button>
            </section>
        </DocPageLayout>
    );
}
