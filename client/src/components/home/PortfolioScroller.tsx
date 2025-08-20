const images = [
  "/imgs/Group 41.webp",
  "/imgs/Group 42.webp",
  "/imgs/Group 43.webp",
  "/imgs/Group 43.webp",
  "/imgs/Group 44.webp",
  "/imgs/Group 45.webp",
  "/imgs/Group 46.webp",
  "/imgs/Group 48.webp",
];

import { useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PortfolioScroller = () => {
  const { slideInFromLeft, staggerFadeIn } = useScrollAnimations();

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Portfolio scroller animations
    slideInFromLeft(".portfolio-title");
    staggerFadeIn(".portfolio-text-line", 0.1);

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
          <h2 className="portfolio-title text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-snug">
            비디오크루의 영상제작 사례
          </h2>
          <div className="portfolio-subtitle">
            <div className="portfolio-text-line text-sm xs:text-base sm:text-lg md:text-base text-gray-400 leading-relaxed">
              당신의 이야기에 생명을 불어넣는 영상,
            </div>
            <div className="portfolio-text-line text-sm xs:text-base sm:text-lg md:text-base text-gray-400 leading-relaxed block sm:hidden">
              비디오크루가 만듭니다.
            </div>
            <div className="portfolio-text-line text-sm xs:text-base sm:text-lg md:text-base text-gray-400 leading-relaxed">
              모든 프레임에 가치를 담다, 비디오크루
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Rows */}
      <div className="space-y-3 xs:space-y-4 sm:space-y-6 mt-8 xs:mt-12 sm:mt-16 md:mt-20 lg:mt-24">
        {/* Row 1 - Left to Right */}
        <div className="portfolio-row-1 flex gap-2 xs:gap-3 sm:gap-4 animate-scroll-left px-4 xs:px-6 sm:px-0 opacity-0">
          {[...images, ...images].map((src, i) => (
            <img
              key={`row1-${i}`}
              src={src}
              alt={`scroll-1-${i}`}
              className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[280px] lg:w-[320px] xl:w-[360px] h-[110px] xs:h-[120px] sm:h-[130px] md:h-[160px] lg:h-[180px] xl:h-[201px] object-cover rounded-md flex-shrink-0 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            />
          ))}
        </div>

        {/* Row 2 - Right to Left */}
        <div className="portfolio-row-2 flex gap-2 xs:gap-3 sm:gap-4 animate-scroll-right px-4 xs:px-6 sm:px-0 opacity-0">
          {[...images, ...images].map((src, i) => (
            <img
              key={`row2-${i}`}
              src={src}
              alt={`scroll-2-${i}`}
              className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[280px] lg:w-[320px] xl:w-[360px] h-[110px] xs:h-[120px] sm:h-[130px] md:h-[160px] lg:h-[180px] xl:h-[201px] object-cover rounded-md flex-shrink-0 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioScroller;
