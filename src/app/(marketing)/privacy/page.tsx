
import { DocPageLayout } from "@/components/doc-page-layout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | VisionHub AI',
  description: 'Read the privacy policy for the VisionHub AI platform.',
};

const sections = [
    { id: 'information-collection', title: '1. Information We Collect' },
    { id: 'how-we-use-info', title: '2. How We Use Your Information' },
    { id: 'cookies-and-tracking', title: '3. Cookies and Tracking Technologies' },
    { id: 'data-security', title: '4. Data Security' },
];

export default function PrivacyPage() {
    return (
        <DocPageLayout
            title="Privacy Policy"
            description="Last updated: "
            sections={sections}
        >
            <section id="information-collection">
                <h2>1. Information We Collect</h2>
                <p>We collect information about you directly from you and automatically through your use of our Service. The types of information we collect include:</p>
                <ul className="list-disc list-inside space-y-2 my-4">
                    <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password. If you sign in with a third-party service like Google, we receive information from that service, such as your name and email address.</li>
                    <li><strong>Usage Data:</strong> We automatically collect information about your interaction with our Service, including the prompts you submit, the images you generate, the features you use, your IP address, browser type, and device information.</li>
                    <li><strong>Payment Information:</strong> If you subscribe to a paid plan, our third-party payment processor will collect and process your payment information. We do not store your full credit card details on our servers.</li>
                </ul>
            </section>
            
            <section id="how-we-use-info">
                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect for various purposes, including:</p>
                <ul className="list-disc list-inside space-y-2 my-4">
                    <li><strong>To Provide and Maintain the Service:</strong> To create and manage your account, process transactions, and provide you with the features and functionalities of VisionHub AI.</li>
                    <li><strong>To Improve the Service:</strong> To understand how users interact with our platform, to improve our AI models, and to develop new features and services. Your prompts and generated images may be used to train our AI models, but we will not use your personal information for this purpose without your consent.</li>
                    <li><strong>To Communicate with You:</strong> To send you service-related announcements, updates, security alerts, and support messages.</li>
                    <li><strong>For Security and Fraud Prevention:</strong> To protect the security of our Service, our users, and to prevent fraudulent activity.</li>
                </ul>
            </section>

            <section id="cookies-and-tracking">
                <h2>3. Cookies and Tracking Technologies</h2>
                <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. They are sent to your browser from a website and stored on your device. We use cookies for several purposes:</p>
                <ul className="list-disc list-inside space-y-2 my-4">
                    <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.</li>
                    <li><strong>Preferences Cookies:</strong> These cookies allow our website to remember choices you make, such as your theme preference (light or dark mode), to provide a more personalized experience.</li>
                    <li><strong>Consent Cookies:</strong> When you accept our cookie policy, we use a cookie to remember your consent choice so that we don't have to ask you again on subsequent visits.</li>
                </ul>
                <p>You will be shown a cookie consent banner when you first visit our site. By clicking "Accept", you agree to our use of these cookies. You can manage your preferences at any time, though disabling certain cookies may affect the functionality of the site.</p>
            </section>

            <section id="data-security">
                <h2>4. Data Security</h2>
                <p>We implement a variety of security measures to maintain the safety of your personal information. Your account is protected by a password, and we encourage you to use a strong password that is unique to our Service. We use encryption (such as SSL) to protect data transmitted to and from our site.</p>
                <p>However, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@visionhub.ai.</p>
            </section>
        </DocPageLayout>
    );
}
