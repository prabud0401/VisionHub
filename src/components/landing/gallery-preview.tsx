
'use client';
import Image from 'next/image';

const galleryImages = [
    { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/6a147e40-887c-4a37-b5b1-d5867a57a922.jpeg' },
    { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/9903a45e-a612-4c25-829d-128a1a364132.jpeg' },
    { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/456d0d21-f2cb-4a81-a675-01e51351152a.jpeg' },
    { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/03b13735-a7b7-4e3c-a99f-0746654497a7.jpeg' },
    { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/64f15f69-7253-46a4-966a-7434311855e9.jpeg' },
    { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/33423bdf-22d5-450f-9694-0f04b281f6e2.jpeg' },
    { src: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/a45a6e51-c0e4-411a-a035-7c3984e79782.jpeg' },
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
        <h2 className="text-3xl font-bold tracking-tighter">Creations From Our Community</h2>
        <p className="mt-4 text-lg text-muted-foreground">Get inspired by what others are creating.</p>
      </div>
      <div className="space-y-4">
        <MarqueeRow images={galleryImages} />
        <MarqueeRow images={[...galleryImages].reverse()} reverse />
        <MarqueeRow images={galleryImages.slice(2).concat(galleryImages.slice(0, 2))} />
      </div>
    </section>
  );
}
