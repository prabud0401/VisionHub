import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | VisionHub AI',
  description: 'Manage your account settings.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Settings
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Manage your account and application settings here.
        </p>
      </div>
      <div className="bg-card p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">
          This page is under construction. Check back later for more settings and options.
        </p>
      </div>
    </div>
  );
}
