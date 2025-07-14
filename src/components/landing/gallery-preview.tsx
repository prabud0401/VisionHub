'use client';
import Image from 'next/image';

const galleryImages = [
  { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/ai-image-generator-hero-image.png' },
  { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/ai-image-generator-hero-image.png' },
  { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/ai-image-generator-hero-image.png' },
  { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/ai-image-generator-hero-image.png' },
  { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/ai-image-generator-hero-image.png' },
  { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/ai-image-generator-hero-image.png' },
  { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/ai-image-generator-hero-image.png' },
];

const MarqueeRow = ({ images, reverse = false }: { images: typeof galleryImages, reverse?: boolean }) => (
  <div className="flex w-max items-center">
    <div className={`flex w-max items-center ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
      {images.map((img, i) => (
        <div key={`marquee-${i}`} className="w-64 h-64 p-2">
           <Image
            src={img.src}
            alt="AI generated art preview"
            width={400}
            height={400}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
          />
        </div>
      ))}
    </div>
    <div className={`flex w-max items-center ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
      {images.map((img, i) => (
        <div key={`marquee-clone-${i}`} className="w-64 h-64 p-2">
           <Image
            src={img.src}
            alt="AI generated art preview"
            width={400}
            height={400}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
          />
        </div>
      ))}
    </div>
  </div>
);

export default function GalleryPreview() {
  return (
    <section id="gallery" className="py-20 bg-transparent overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="pixelated-font text-3xl font-bold tracking-tighter">Platform Gallery</h2>
      </div>
      <div className="space-y-4">
        <MarqueeRow images={galleryImages} />
        <MarqueeRow images={[...galleryImages].reverse()} reverse />
        <MarqueeRow images={galleryImages.slice(2).concat(galleryImages.slice(0, 2))} />
      </div>
    </section>
  );
}
