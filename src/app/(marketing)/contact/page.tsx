
import { DocPageLayout } from "@/components/doc-page-layout";
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Contact Us | VisionHub AI',
  description: 'Get in touch with the VisionHub AI team.',
};

const sections = [
    { id: 'contact-form', title: 'Contact Form' },
    { id: 'other-methods', title: 'Other Ways to Reach Us' },
    { id: 'our-location', title: 'Our Location' },
];

export default function ContactPage() {
    return (
        <DocPageLayout
            title="Contact Us"
            description="Have a question, feedback, or a partnership inquiry? We'd love to hear from you."
            sections={sections}
        >
            <section id="contact-form">
                <h2>Contact Form</h2>
                <p>The easiest way to get in touch is to use the form below. We'll do our best to get back to you within 24-48 hours.</p>
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription>Fill out the form and our team will get back to you shortly.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="e.g., Partnership Inquiry" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." rows={6} />
                            </div>
                            <Button type="submit">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
            </section>
            
            <section id="other-methods">
                <h2>Other Ways to Reach Us</h2>
                <p>If you prefer other methods of communication, here are a few options:</p>
                <ul className="list-disc list-inside space-y-2 my-4">
                    <li><strong>Support Email:</strong> For technical issues or questions, please email us at <a href="mailto:prabud0401@gmail.com">prabud0401@gmail.com</a>.</li>
                    <li><strong>Phone:</strong> You can reach us at <a href="tel:+94760704491">+94760704491</a> for urgent inquiries.</li>
                    <li><strong>Social Media:</strong> You can also reach out to us on our social media channels. Find the links in our website footer.</li>
                </ul>
            </section>

            <section id="our-location">
                <h2>Our Location</h2>
                <p>While we are a remote-first company, our main office is located in Sri Lanka.</p>
                <address className="not-italic my-4 p-4 border-l-4">
                    VisionHub AI<br />
                    No 15, Amherst<br />
                    Udapussellawa, Nuwara Eliya<br />
                    Sri Lanka
                </address>
                 <div className="relative w-full h-80 rounded-lg overflow-hidden my-8">
                     <Image src="/images/contact-location.png" alt="Map of our location" layout="fill" objectFit="cover" data-ai-hint="A modern, minimalist office building with lots of glass windows, surrounded by lush green trees. Bright, sunny day. Architectural photography." />
                </div>
            </section>
        </DocPageLayout>
    );
}
