
'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ComingSoonProps {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export function ComingSoon({ title, description, imageUrl, imageHint }: ComingSoonProps) {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full text-center relative overflow-hidden">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="relative p-6 md:p-12">
            <CardHeader>
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <Loader2 className="h-24 w-24 text-primary/50 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full border-4 border-dashed border-primary animate-spin [animation-direction:reverse]"></div>
                    </div>
                </div>
            </div>
            <CardTitle className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
                {title}
            </CardTitle>
            <CardDescription className="mt-4 text-lg text-muted-foreground">
                Coming Soon!
            </CardDescription>
            </CardHeader>
            <CardContent>
            <p className="max-w-2xl mx-auto">
                {description}
            </p>
            <div className="mt-8 opacity-20">
                <Image
                    src={imageUrl}
                    alt="Coming Soon Placeholder"
                    width={400}
                    height={250}
                    className="rounded-lg mx-auto shadow-lg"
                />
            </div>
            </CardContent>
        </div>
      </Card>
    </div>
  );
}
