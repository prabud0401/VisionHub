
'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const features = [
  { feature: 'Image Generation Credits', starter: '100 / mo', basic: '500 / mo', standard: '1,500 / mo', premium: 'Custom' },
  { feature: 'Gallery Storage Limit', starter: '25 Images', basic: '50 Images', standard: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Available AI Models', starter: 'Limited', basic: 'Limited', standard: 'All Models', premium: 'All Models + Beta' },
  { feature: 'Image Quality', starter: 'Standard', basic: 'Standard', standard: 'High Quality', premium: 'Up to 4K+' },
  { feature: 'Image Upgrade Suite', starter: false, basic: false, standard: true, premium: true },
  { feature: 'Ad-Free Experience', starter: false, basic: false, standard: true, premium: true },
  { feature: 'Prompt Enhancer', starter: false, basic: true, standard: true, premium: true },
  { feature: 'API Access', starter: false, basic: false, standard: false, premium: true },
  { feature: 'Priority Support', starter: false, basic: false, standard: true, premium: 'Dedicated Support' },
];

const Check = () => <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />;
const Cross = () => <XCircle className="mx-auto h-6 w-6 text-red-500/80" />;

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
        
        <Card className="bg-card/90 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b-border/50">
                            <TableHead className="text-lg w-[30%] pl-6">Features</TableHead>
                            <TableHead className="text-center text-lg">Starter</TableHead>
                            <TableHead className="text-center text-lg">Basic</TableHead>
                            <TableHead className="text-center text-lg text-primary">Standard</TableHead>
                            <TableHead className="text-center text-lg">Custom</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {features.map((item) => (
                           <TableRow 
                             key={item.feature} 
                             className="hover:bg-primary/5 border-b-border/20"
                            >
                                <TableCell className="font-semibold pl-6">{item.feature}</TableCell>
                                <TableCell className="text-center"><FeatureCell value={item.starter} /></TableCell>
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
