import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import LazyImage from "../common/LazyImage";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Array of banner images for the carousel
  const bannerImages = [
    "/imgs/Banner-Image.webp",
    "/imgs/Banner-Image2.webp",
    "/imgs/Banner-Image3.webp",
    "/imgs/Banner-Image4.webp",
  ];

  // Array of text content for each carousel slide
  const carouselContent = [
    {
      subtitle:
        '"이번엔 정말 제대로 된 업체를 찾고 싶다..."\n혹시 이런 마음으로 여기까지 오셨나요?\n축하드립니다!',
      title: "비디오크루가 정답입니다!",
    },
    {
      subtitle:
        "전문적인 영상 제작부터\n창의적인 스토리텔링까지\n모든 것을 담당합니다",
      title: "완벽한 영상 제작 서비스",
    },
    {
      subtitle:
        "고객의 비전을 현실로\n만들어내는 우리만의\n특별한 노하우가 있습니다",
      title: "창의력과 기술력의 조화",
    },
    {
      subtitle: "함께 만들어가는\n성공적인 프로젝트\n지금 시작하세요",
      title: "당신의 아이디어를 현실로!",
    },
  ];

  // Hero section animations
  useEffect(() => {
    if (heroRef.current && textRef.current) {
      // Initial hero animation
      const heroTimeline = gsap.timeline();

      heroTimeline
        .fromTo(
          heroRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out" }
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.1, ease: "power3.inOut" },
          "-=0.3"
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

  // Text animation on carousel change
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }
  }, [currentImageIndex]);

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
          <LazyImage
            src={image}
            alt={`비디오크루 배너 이미지 ${index + 1} - ${
              carouselContent[index].title
            }`}
            className="absolute top-0 left-0 w-full h-full object-cover object-[center_30%] sm:object-[center_25%] md:object-top -translate-y-2 xs:-translate-y-3 sm:-translate-y-4 md:-translate-y-5"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* HeroSection Content */}
      <div className="relative z-20 flex flex-col h-[80vh] justify-end items-center md:items-start text-center md:text-left">
        <div className="max-w-[1248px] mx-auto px-4 xs:px-6 md:px-8 lg:px-6 -mb-6 xs:-mb-8 w-full">
          {/* Fixed height container for text to prevent layout shifts */}
          <div
            ref={textRef}
            className="min-h-[100px] xs:min-h-[110px] sm:min-h-[120px] md:min-h-[100px] lg:min-h-[110px] flex flex-col justify-end"
          >
            <h1 className="hero-subtitle text-sm xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-normal leading-snug max-w-2xl xs:max-w-3xl mx-auto md:mx-0 transition-all duration-500 ease-in-out">
              {carouselContent[currentImageIndex].subtitle
                .split("\n")
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    {index <
                      carouselContent[currentImageIndex].subtitle.split("\n")
                        .length -
                        1 && <br />}
                  </span>
                ))}
            </h1>
            <p className="hero-title mt-4 xs:mt-6 text-lg xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mx-auto md:mx-0 transition-all duration-500 ease-in-out">
              {carouselContent[currentImageIndex].title}
            </p>
          </div>

          {/* Carousel Dots - Fixed position */}
          <div className="hero-dots flex items-center justify-center md:justify-start space-x-2 xs:space-x-3 mt-6 xs:mt-8">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`carousel-dot transition-all duration-300 ease-in-out ${
                  index === currentImageIndex
                    ? "w-3 h-3 xs:w-4 xs:h-4 border-2 border-white rounded-full"
                    : "w-2.5 h-2.5 xs:w-3 xs:h-3 border border-white rounded-full opacity-40 hover:opacity-60"
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
