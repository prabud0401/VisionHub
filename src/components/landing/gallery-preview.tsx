
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
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F0f26ccb7-9f09-4984-9d1f-25a1cabdd587.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F18b603ef-bef5-4b5b-9ec9-72f8bb360358.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F260bb9d5-28e3-4bf2-a229-0eaccf5e50d3.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F4b70c293-abc7-44d6-8e31-11f70663a476.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F56e01655-8faf-41a9-ba21-b3ba0aa84d14.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F5fdecfe2-3ee7-4ec0-aae5-6ec078307f22.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F6d29a9de-8324-4835-982c-03e7c729d641.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F70303f86-d84e-4abc-b24e-f80830f78aa4.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F76b739cd-ca34-4f74-96fe-b7ab3b3345f3.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F775f262e-bdee-4586-a89d-c36e7b9112b7.png?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F85d84a37-54e0-4f43-81d5-bc4f14c56c28.png?alt=media"
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
