
'use client';
import Image from 'next/image';

const galleryImageUrls = [
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F2ccd4f85-7fa4-468d-92ac-e80e41af5a39.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F3859edeb-c27b-4a27-bc8b-b78405da06e5.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F5dab8967-a114-4018-ae3e-adba8aa78de1.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F6e8b8d45-91cc-4c58-afa3-0794a536b89d.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2Fbc9bc6be-11b4-4125-bb38-668b9539b00c.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2Fbf6ab35f-9f35-4c21-a6e7-8dd307a5c82b.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2Fe6b176e0-fd43-4c40-a798-70e3ff23a025.png?alt=media",
];

const galleryImages = galleryImageUrls.map(url => ({ src: url }));


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
