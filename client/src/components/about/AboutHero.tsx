import { useState, useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";

const AboutHero = () => {
  const { parallaxEffect, fadeInUp, staggerFadeIn } = useScrollAnimations();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of banner images for the carousel
  const bannerImages = [
    "/imgs/about/Frame.webp",
    "/imgs/about/Frame-3.webp",
    "/imgs/about/Frame-3.webp",
    "/imgs/about/Frame-4.webp",
    "/imgs/about/Frame-5.webp",
  ];

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Hero animations
  useEffect(() => {
    parallaxEffect(".about-hero-image", 0.3);
    fadeInUp(".about-hero-text");
    // Remove staggerFadeIn for dots to keep them visible
  }, []);

  // Handle dot click to manually change image
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="w-full bg-black text-white py-12 md:py-16 lg:py-20">
      <div className="max-w-[1248px] mx-auto px-0 sm:px-6 md:px-4 lg:px-0">
        {/* Flex container to handle centering on mobile */}
        <div className="flex justify-center md:justify-start">
          {/* Portrait Card */}
          <div className="relative aspect-[3/4] w-[302px] md:w-full md:h-[550px] lg:h-[600px] rounded-xs overflow-hidden bg-black">
            {/* Carousel Images */}
            {bannerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Video Crew Banner ${index + 1}`}
                className={`about-hero-image absolute top-0 left-0 w-full h-full object-cover rounded-xs transition-opacity duration-1500 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Text overlay */}
            <div className="absolute bottom-12 left-4 right-4 md:bottom-16 md:left-8 md:right-auto lg:bottom-20 lg:left-10 about-hero-text">
              <div>
                <div>
                  <h3 className="text-sm md:text-base lg:text-lg font-semibold">회사소개</h3>
                  <p className="text-sm md:text-sm lg:text-sm leading-snug mt-1">
                    <span className="font-semibold">Video Crew,</span>
                    <br />
                    <span className="font-medium opacity-75">
                      Video Consulting Firm
                    </span>
                  </p>
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="flex items-center space-x-2 mt-2 md:mt-3 lg:mt-4">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`transition-all duration-300 ease-in-out rounded-full ${
                      index === currentImageIndex
                        ? "w-2.5 h-2.5 border-2 border-white"
                        : "w-2 h-2 border border-white opacity-40 hover:opacity-60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
