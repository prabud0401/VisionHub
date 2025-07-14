'use client';
import { Button } from '../ui/button';
import Faq from '../faq';

export default function FaqSection() {
    return (
        <section id="faq" className="w-full py-20 bg-card/80 backdrop-blur-sm rounded-lg">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Have Questions?<br/>We have Answers !</h2>
              <div className="mt-8">
                <Button variant="accent" size="lg">Contact Us</Button>
              </div>
            </div>
            
            <div className="w-full">
              <Faq />
            </div>
          </div>
        </section>
    );
}
