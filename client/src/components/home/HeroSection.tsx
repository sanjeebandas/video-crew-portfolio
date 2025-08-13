import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Auto-advance carousel every 1 second
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
    <section className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Carousel Images */}
      {bannerImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Video Crew Banner ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover object-[center_30%] md:object-top z-0 -translate-y-3 md:-translate-y-5 transition-opacity duration-1500 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* HeroSection Content */}
      <div className="relative z-20 flex flex-col h-[80vh] justify-end items-center md:items-start text-center md:text-left">
        <div className="max-w-[1248px] mx-auto px-4 -mb-8 w-full">
          {/* Fixed height container for text to prevent layout shifts */}
          <div className="min-h-[120px] md:min-h-[100px] flex flex-col justify-end">
            <h1 className="text-sm opacity-75 md:text-2xl lg:text-xl font-normal leading-snug max-w-3xl mx-auto md:mx-0 transition-all duration-1500 ease-in-out">
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
            <p className="mt-6 text-lg md:text-3xl lg:text-4xl font-bold text-white mx-auto md:mx-0 transition-all duration-1500 ease-in-out">
              {carouselContent[currentImageIndex].title}
            </p>
          </div>

          {/* Carousel Dots - Fixed position */}
          <div className="flex items-center justify-center md:justify-start space-x-2 mt-8">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ease-in-out ${
                  index === currentImageIndex
                    ? "w-4 h-4 border-2 border-white rounded-full"
                    : "w-3 h-3 border border-white rounded-full opacity-40 hover:opacity-60"
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
