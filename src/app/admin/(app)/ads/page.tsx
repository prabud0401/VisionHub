
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adSlots } from '@/lib/ads-config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code, Lightbulb } from 'lucide-react';

export default function AdminAdManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ad Management</h1>
        <p className="text-muted-foreground">
          Review and manage the ad placements across your application.
        </p>
      </div>

      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>How this works</AlertTitle>
        <AlertDescription>
          This page displays the current ad configurations from the{' '}
          <code className="font-mono text-xs bg-muted p-1 rounded-sm">src/lib/ads-config.tsx</code> file.
          To update an ad unit, you must edit the code in that file directly. Future updates could allow editing from this dashboard.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.values(adSlots).map((slot) => (
          <Card key={slot.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                {slot.id}
              </CardTitle>
              <CardDescription>
                This ad is displayed in the application based on user settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Ad Preview:</h4>
              <div className="border rounded-lg p-4 bg-background">
                  {slot.component}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
