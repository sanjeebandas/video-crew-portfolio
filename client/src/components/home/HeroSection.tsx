import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import LazyImage from "../common/LazyImage";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<boolean[]>([]);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  // Array of banner images for the carousel
  const bannerImages = [
    "/imgs/main_01.webp",
    "/imgs/main_02.webp",
    "/imgs/main_04.webp",
    "/imgs/main_05.webp",
  ];

  // Initialize image load states
  useEffect(() => {
    setImageLoadStates(new Array(bannerImages.length).fill(false));
    setImageErrors(new Array(bannerImages.length).fill(false));
  }, [bannerImages.length]);


  // Hero section animations
  useEffect(() => {
    if (heroRef.current) {
      // Initial hero animation
      const heroTimeline = gsap.timeline();

      heroTimeline
        .fromTo(
          heroRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out" }
        )
        .fromTo(
          ".hero-dots",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.2"
        );

      // Carousel dot animations
      gsap.fromTo(
        ".carousel-dot",
        { scale: 0.8, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );
    }
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageLoad = (index: number) => {
    setImageLoadStates((prev) => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen bg-black text-white overflow-hidden"
    >
      {/* Carousel Images */}
      {bannerImages.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full z-0 transition-opacity duration-500 ease-in-out ${
            index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Loading state */}
          {!imageLoadStates[index] && !imageErrors[index] && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error state */}
          {imageErrors[index] && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">
                  이미지를 불러올 수 없습니다
                </p>
              </div>
            </div>
          )}

          {/* Image */}
          {!imageErrors[index] && (
            <LazyImage
              src={image}
              alt={`비디오크루 배너 이미지 ${index + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover object-[center_30%] sm:object-[center_25%] md:object-top -translate-y-2 xs:-translate-y-3 sm:-translate-y-4 md:-translate-y-5"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
          )}

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      ))}

      {/* Carousel Dots */}
      <div className="relative z-20 flex flex-col h-[80vh] justify-end items-center md:items-start text-center md:text-left">
        <div className="max-w-[1248px] mx-auto px-4 xs:px-6 md:px-8 lg:px-2 -mb-6 xs:-mb-8 w-full">
          <div className="hero-dots flex items-center justify-center md:justify-start space-x-2 xs:space-x-3 mt-6 xs:mt-8">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`carousel-dot transition-all duration-300 ease-in-out ${
                  index === currentImageIndex
                    ? "w-4 h-4 xs:w-5 xs:h-5 border-2 border-white rounded-full"
                    : "w-3 h-3 xs:w-4 xs:h-4 border border-white rounded-full opacity-40 hover:opacity-60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
