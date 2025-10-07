const images = [
  "imgs/portfolio_scroller_images/portfolio_image_1.webp",
  "imgs/portfolio_scroller_images/portfolio_image_2.webp",
  "imgs/portfolio_scroller_images/portfolio_image_3.webp",
  "imgs/portfolio_scroller_images/portfolio_image_4.webp",
  "imgs/portfolio_scroller_images/portfolio_image_5.webp",
  "imgs/portfolio_scroller_images/portfolio_image_6.webp",
  "imgs/portfolio_scroller_images/portfolio_image_7.webp",
  "imgs/portfolio_scroller_images/portfolio_image_8.webp",
];

import { useEffect, useState } from "react";
import { useScrollAnimations } from "../../utils/animations";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PortfolioScroller = () => {
  const { slideUpFadeIn } = useScrollAnimations();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (src: string) => {
    setImageErrors((prev) => new Set([...prev, src]));
  };

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Portfolio scroller animations
    slideUpFadeIn(".portfolio-title");
    slideUpFadeIn(".portfolio-text-line");

    // Synchronized row animations - row 1 fades down, row 2 fades up
    gsap.fromTo(
      ".portfolio-row-1",
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".portfolio-row-1",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".portfolio-row-2",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".portfolio-row-2",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section className="bg-black pt-0 pb-8 xs:pb-10 md:pb-12 overflow-hidden w-full">
      {/* Text Block */}
      <div className="w-full px-4 xs:px-6 md:px-8 lg:px-6">
        <div className="max-w-[1248px] mx-auto text-center text-white mb-4 xs:mb-6">
          <h2 className="portfolio-title text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-2 leading-snug">
            비디오크루의 영상 제작 사례
          </h2>
          <div className="portfolio-subtitle">
            <div className="portfolio-text-line text-sm xs:text-base sm:text-lg md:text-base text-muted leading-relaxed">
              당신의 이야기에 생명을 불어넣는 영상
            </div>
            <div className="portfolio-text-line text-sm xs:text-base sm:text-lg md:text-base text-muted leading-relaxed">
              모든 프레임에 가치를 담다
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Rows */}
      <div className="space-y-3 xs:space-y-4 sm:space-y-6 mt-8 xs:mt-12 sm:mt-16 md:mt-20 lg:mt-24">
        {/* Row 1 - Left to Right */}
        <div className="portfolio-row-1 flex gap-2 xs:gap-3 sm:gap-4 animate-scroll-left px-4 xs:px-6 sm:px-0 opacity-0">
          {[...images, ...images].map((src, i) => (
            <div
              key={`row1-${i}`}
              className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[280px] lg:w-[320px] xl:w-[360px] h-[110px] xs:h-[120px] sm:h-[130px] md:h-[160px] lg:h-[180px] xl:h-[201px] rounded-md flex-shrink-0 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
            >
              {!imageErrors.has(src) ? (
                <img
                  src={src}
                  alt={`scroll-1-${i}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(src)}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-8 h-8 mx-auto mb-1 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
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
                    <p className="text-xs text-gray-400">이미지 로드 실패</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Row 2 - Right to Left */}
        <div className="portfolio-row-2 flex gap-2 xs:gap-3 sm:gap-4 animate-scroll-right px-4 xs:px-6 sm:px-0 opacity-0">
          {[...images, ...images].map((src, i) => (
            <div
              key={`row2-${i}`}
              className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[280px] lg:w-[320px] xl:w-[360px] h-[110px] xs:h-[120px] sm:h-[130px] md:h-[160px] lg:h-[180px] xl:h-[201px] rounded-md flex-shrink-0 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
            >
              {!imageErrors.has(src) ? (
                <img
                  src={src}
                  alt={`scroll-2-${i}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(src)}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-8 h-8 mx-auto mb-1 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
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
                    <p className="text-xs text-gray-400">이미지 로드 실패</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioScroller;
