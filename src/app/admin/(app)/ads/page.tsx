
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { adSlots } from '@/lib/ads-config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminAdManagementPage() {
  const adSlotEntries = Object.values(adSlots);

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
          To update an ad unit or toggle its active status, you must edit the `active` property or the component code in that file directly.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {adSlotEntries.map((slot) => (
          <Card key={slot.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                        {slot.id}
                    </CardTitle>
                    <CardDescription className="mt-2">
                        {slot.description}
                    </CardDescription>
                  </div>
                  <Badge variant={slot.active ? 'secondary' : 'destructive'} className={slot.active ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}>
                    {slot.active ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3" />}
                    {slot.active ? 'Active' : 'Inactive'}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Ad Preview:</h4>
              <div className="border rounded-lg bg-background aspect-video w-full">
                  {slot.component}
              </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" asChild>
                    <a href="vscode://file/src/lib/ads-config.tsx" target="_blank" rel="noopener noreferrer">
                         <Code className="mr-2 h-4 w-4" /> Edit Config File
                    </a>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
