'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Sarah J.', title: 'Digital Artist', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', quote: "VisionHub has completely transformed my creative process. The character consistency is a game-changer for my webcomic!" },
  { name: 'Mike R.', title: 'Game Developer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', quote: "The quality of the generated assets is incredible. I can prototype environments and characters in a fraction of the time." },
  { name: 'Elena T.', title: 'Marketing Manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', quote: "We use VisionHub for all our campaign visuals. It's fast, versatile, and the results are always stunning. Highly recommended." },
  { name: 'David L.', title: 'Hobbyist Creator', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', quote: "As someone just getting into AI art, this platform is so intuitive and powerful. I'm hooked!" },
];

export default function Testimonials() {
  return (
    <section id="about" className="py-20 bg-transparent">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-primary font-semibold">WALL OF LOVE ❤️</h3>
        <h2 className="text-3xl font-bold font-headline mt-2 mb-12">Join 1M+ users creating art using VisionHub</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 text-left">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
