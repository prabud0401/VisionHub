'use client';
import { Button } from '../ui/button';
import Faq from '../faq';

export default function FaqSection() {
    return (
        <section id="faq" className="w-full py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
                <p className="mt-4 text-muted-foreground">
                  Can't find the answer you're looking for? Reach out to our customer support team.
                </p>
                <div className="mt-8">
                  <Button variant="outline" size="lg">Contact Us</Button>
                </div>
              </div>
              
              <div className="w-full">
                <Faq />
              </div>
            </div>
          </div>
        </section>
    );
}
