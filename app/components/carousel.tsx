//@ts-nocheck
//@ts-ignore
'use client'
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://uploadcarimages.sgp1.digitaloceanspaces.com/recruitment/artboard.jpg',
    // title: 'Beautiful Beach',
    // description: 'Discover the serene beauty of tropical beaches.',
  } 
];

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    startIndex: 0,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => console.log(`Image ${index} loaded: ${slide.image}`);
      img.onerror = () => console.log(`Image ${index} failed: ${slide.image}`);
    });
  }, []);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      setScrollSnaps(emblaApi.scrollSnapList());
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });

      // Preload all slides
      const slides = document.querySelectorAll('.embla .flex > div');
      slides.forEach((_, index) => {
        emblaApi.scrollTo(index, true);
      });
      emblaApi.scrollTo(0, true);
    }
  }, [emblaApi]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden embla" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            console.log(`Rendering slide ${index}: ${slide.image}`);
            return (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative "
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading="lazy"
                  className="w-full h-[500px] object-cover rounded-lg"
                  onError={(e) => {
                    console.log(`Failed to load image: ${slide.image}`);
                    e.target.src = 'https://via.placeholder.com/1200x500';
                  }}
                />
                <div className="absolute inset-0  flex items-end p-6">
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-lg">{slide.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
{/* 
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        onClick={scrollNext}
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button> */}

      <div className="flex justify-center mt-4 space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;