'use client'; // Required for Next.js 15 client-side component

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselItem {
    id: number;
    imageUrl: string;
    alt: string;
    title?: string;
    description?: string;
}

const carouselItems: CarouselItem[] = [
    {
        id: 1,
        imageUrl: 'https://uploadcarimages.sgp1.digitaloceanspaces.com/recruitment/artboard.jpg',
        alt: 'Nature Landscape 1',
        title: 'Explore Nature',
        description: 'Discover the beauty of serene landscapes.',
    },
    {
        id: 2,
        imageUrl: 'https://uploadcarimages.sgp1.digitaloceanspaces.com/recruitment/artboard.jpg',
        alt: 'Beach Sunset',
        title: 'Beach Sunset',
        description: 'Relax with stunning sunset views.',
    },
    {
        id: 3,
        imageUrl: 'https://uploadcarimages.sgp1.digitaloceanspaces.com/recruitment/artboard.jpg',
        alt: 'Mountain Peaks',
        title: 'Mountain Adventure',
        description: 'Embark on a thrilling mountain journey.',
    },
];

const Carousel: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Autoplay logic
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [isPaused]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    };

    return (
        <div
            className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            role="region"
            aria-label="Image carousel"
        >
            {/* Slides */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {carouselItems.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-full h-[500px] relative flex items-center justify-center"
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.alt}
                            className="object-cover w-full h-full"
                        // loading={item.id === 1 ? "eager" : "lazy"}
                        />
                        {/* 
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
                            {item.title && (
                                <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
                            )}
                            {item.description && (
                                <p className="text-lg text-center max-w-md">{item.description}</p>
                            )}
                        </div> */}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous slide"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http:// SVG namespace"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next slide"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http:// SVG namespace"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSlide === index ? 'bg-blue-500' : 'bg-white bg-opacity-50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;