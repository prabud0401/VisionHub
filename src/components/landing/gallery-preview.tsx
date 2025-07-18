'use client';
import Image from 'next/image';

const galleryImageUrls = [
    "/images/gallery/1.png",
    "/images/gallery/2.png",
    "/images/gallery/3.png",
    "/images/gallery/4.png",
    "/images/gallery/5.png",
    "/images/gallery/6.png",
    "/images/gallery/7.png",
    "/images/gallery/8.png",
    "/images/gallery/9.png",
    "/images/gallery/10.png",
    "/images/gallery/11.png",
    "/images/gallery/12.png",
    "/images/gallery/13.png",
    "/images/gallery/14.png",
    "/images/gallery/15.png",
    "/images/gallery/16.png",
];

const galleryImages = galleryImageUrls.map(url => ({ src: url }));

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: typeof galleryImages) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

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
  const shuffledRow1 = shuffleArray(galleryImages);
  const shuffledRow2 = shuffleArray(galleryImages);
  const shuffledRow3 = shuffleArray(galleryImages);
  
  return (
    <section id="gallery" className="py-20 bg-transparent overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter">Creations From Our Community</h2>
        <p className="mt-4 text-lg text-muted-foreground">Get inspired by what others are creating.</p>
      </div>
      <div className="space-y-4">
        <MarqueeRow images={shuffledRow1} />
        <MarqueeRow images={shuffledRow2} reverse />
        <MarqueeRow images={shuffledRow3} />
      </div>
    </section>
  );
}
