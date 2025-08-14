import { useEffect, useRef } from "react";
import { useScrollAnimations, cleanupAnimations } from "../utils/animations";
import HeroSection from "../components/home/HeroSection";
import ServicesGrid from "../components/home/ServicesGrid";
import PortfolioScroller from "../components/home/PortfolioScroller";
import BackgroundBanner from "../components/home/BackgroundBanner";

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    slideInFromLeft,
    slideInFromRight,
    fadeInUp,
    stackIn,
    staggerFadeIn,
    parallaxEffect,
  } = useScrollAnimations();

  useEffect(() => {
    // Home page scroll animations
    slideInFromLeft(".home-title-left");
    slideInFromRight(".home-title-right");
    fadeInUp(".home-subtitle");
    staggerFadeIn(".home-text-line", 0.1);
    stackIn(".home-section-card", 0.2);
    parallaxEffect(".home-parallax-bg", 0.3);

    // Trusted companies section animations
    slideInFromLeft(".trusted-companies-title", 0.2);

    // Cleanup on unmount
    return () => {
      cleanupAnimations();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <HeroSection />
      <section className="bg-black text-white w-full px-6 py-20 home-section-card">
        <div className="max-w-[1248px] mx-auto flex flex-col md:flex-row justify-between items-start md:space-x-98 space-y-10 md:space-y-0">
          {/* Left Title Block — fixed to 1 column width */}
          <div className="w-full md:w-[350px] text-center md:text-left home-title-left">
            <p className="text-sm text-gray-400 mb-2 home-subtitle">
              비디오크루의 차별점
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
              영상 제작, 어떻게
              <br />
              하고 계신가요?
            </h2>
          </div>

          {/* Right Paragraph Block — fills the remaining space */}
          <div className="w-full md:flex-1 text-sm sm:text-base text-gray-300 leading-relaxed text-center md:text-left home-title-right">
            <div className="home-text-line">
              비디오크루는 단순한 영상 제작을 넘어, 강력한 스토리텔링과 독창적인
            </div>
            <div className="home-text-line">
              시각적 표현으로 고객의 메시지설명력을 높여주는 비디오 콘텐츠 전문
            </div>
            <div className="home-text-line">
              그룹입니다. 기획부터 촬영, 편집, 그리고 최종 결과물에 이르기까지,
              각
            </div>
            <div className="home-text-line">
              분야의 전문가들이 고객의 비전을 현실도 높은 영상으로 구현합니다.
            </div>
          </div>
        </div>
      </section>

      {/* This comes AFTER the paragraph block */}
      <div className="home-section-card relative z-10">
        <ServicesGrid />
      </div>
      {/* Decorative Separator Image after Services */}
      <img
        src="/imgs/Image.webp"
        alt="Section Separator Design"
        className="w-full h-auto object-cover mb-6 home-parallax-bg relative z-0
             -mt-20 sm:-mt-32 md:-mt-28"
      />

      <div className="home-section-card">
        <PortfolioScroller />
      </div>
      {/* Browse Portfolio Button */}
      <div className="w-full flex justify-center my-8 sm:my-10 home-section-card">
        <div className="max-w-[1248px] w-full flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
            포트폴리오 둘러보기
          </button>
        </div>
      </div>

      {/* Decorative Separator Image after PortfolioScroller */}
      <img
        src="/imgs/Image-1.webp"
        alt="Section Separator Design"
        className="w-full h-auto object-cover -mt-6 sm:mt-14 home-parallax-bg"
      />

      {/* Trusted by Companies Text Block */}
      <div className="w-full text-center text-white -mt-4 sm:-mt-28 mb-20 px-4 home-section-card">
        <h2 className="text-lg md:text-3xl font-bold leading-snug home-title-left trusted-companies-title">
          이미 수많은 기업이 <br />
          비디오크루와 함께 하고 있습니다.
        </h2>
      </div>

      {/* Full-Width Separator Image */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16 mb-12">
        <img
          src="/imgs/Frame 430.webp"
          alt="Section Separator Design"
          className="w-full h-auto object-cover home-parallax-bg "
        />
      </div>

      <div className="home-section-card">
        <BackgroundBanner />
      </div>
    </div>
  );
};

export default Home;
