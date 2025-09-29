import { useState, useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";

const DifferentiationHero = () => {
  const { parallaxEffect, staggerFadeIn } = useScrollAnimations();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of banner images for the carousel
  const bannerImages = [
    "/imgs/differentiation/Frame 424.webp",
    "/imgs/differentiation/DiffFrame-2.webp",
    "/imgs/differentiation/DiffFrame-3.webp",
    "/imgs/differentiation/DiffFrame-4.webp",
    "/imgs/differentiation/DiffFrame-5.webp",
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
    parallaxEffect(".diff-hero-image", 0.3);
    staggerFadeIn(".diff-hero-dot", 0.1);
  }, []);

  // Handle dot click to manually change image
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle navigation buttons
  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="w-full bg-black text-white py-2 md:py-6">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-6">
        <div className="flex justify-center md:justify-start">
          <div className="relative w-[302px] h-[265px] md:w-full md:h-[588px] rounded-xs overflow-hidden">
            {/* Carousel Images */}
            {bannerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Differentiation Banner ${index + 1}`}
                className={`diff-hero-image absolute top-0 left-0 w-full h-full object-cover rounded-xs transition-opacity duration-1500 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Left Navigation Button */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 z-10"
              aria-label="Previous image"
            >
              <i className="fas fa-chevron-left text-sm"></i>
            </button>

            {/* Right Navigation Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 z-10"
              aria-label="Next image"
            >
              <i className="fas fa-chevron-right text-sm"></i>
            </button>

            <div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-2
             md:left-10 md:translate-x-0 md:bottom-20"
            >
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`diff-hero-dot transition-all duration-300 ease-in-out rounded-full ${
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
    </section>
  );
};

export default DifferentiationHero;
