
'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '@/lib/utils';

const features = [
  { feature: 'Image Generation Credits', basic: '500 / mo', standard: '1,500 / mo', premium: '4,000 / mo' },
  { feature: 'Available AI Models', basic: 'Limited', standard: 'All Models', premium: 'All Models + Beta' },
  { feature: 'Image Quality', basic: 'Standard', standard: 'High Quality', premium: 'Up to 4K+' },
  { feature: 'Image Upgrade Suite', basic: false, standard: true, premium: true },
  { feature: 'Prompt Enhancer', basic: true, standard: true, premium: true },
  { feature: 'API Access', basic: false, standard: false, premium: true },
  { feature: 'Priority Support', basic: false, standard: true, premium: 'Dedicated Support' },
];

const Check = () => <CheckCircle2 className="h-6 w-6 text-green-500" />;
const Cross = () => <XCircle className="h-6 w-6 text-red-500/80" />;

const FeatureCell = ({ value }: { value: string | boolean }) => {
  if (typeof value === 'boolean') {
    return value ? <Check /> : <Cross />;
  }
  return <span className="text-sm font-medium">{value}</span>;
};

export function FeatureComparison() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Compare Plans & Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Find the perfect plan to fuel your creative endeavors.
            </p>
        </div>
        
        <Card className="bg-card/90 backdrop-blur-sm overflow-hidden relative shadow-2xl shadow-primary/10">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.02]"
                style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2Fe6b176e0-fd43-4c40-a798-70e3ff23a025.png?alt=media')" }}
            />
             <div className="absolute inset-0 bg-background/80" />
            <CardContent className="p-0 relative">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b-border/50">
                            <TableHead className="text-lg w-[40%]">Features</TableHead>
                            <TableHead className="text-center text-lg">Basic</TableHead>
                            <TableHead className="text-center text-lg text-accent">Standard</TableHead>
                            <TableHead className="text-center text-lg">Premium</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {features.map((item, index) => (
                           <TableRow 
                             key={item.feature} 
                             className="hover:bg-primary/5 border-b-border/20"
                             style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <TableCell className="font-semibold">{item.feature}</TableCell>
                                <TableCell className="text-center"><FeatureCell value={item.basic} /></TableCell>
                                <TableCell className="text-center"><FeatureCell value={item.standard} /></TableCell>
                                <TableCell className="text-center"><FeatureCell value={item.premium} /></TableCell>
                           </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
