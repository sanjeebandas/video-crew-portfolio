import { useState, useEffect } from "react";

const DifferentiationHero = () => {
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

  // Handle dot click to manually change image
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="w-full bg-black text-white py-2 md:py-6">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-0">
        <div className="flex justify-center md:justify-start">
          <div className="relative w-[302px] h-[265px] md:w-full md:h-[588px] rounded-xs overflow-hidden">
            {/* Carousel Images */}
            {bannerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Differentiation Banner ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover rounded-xs transition-opacity duration-1500 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2
             md:left-10 md:translate-x-0 md:bottom-6"
            >
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
    </section>
  );
};

export default DifferentiationHero;
