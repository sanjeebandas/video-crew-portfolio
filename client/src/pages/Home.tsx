import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useScrollAnimations,
  cleanupAnimations,
  refreshGSAPAnimations,
} from "../utils/animations";
import HeroSection from "../components/home/HeroSection";
import ServicesGrid from "../components/home/ServicesGrid";
import PortfolioScroller from "../components/home/PortfolioScroller";
import BackgroundBanner from "../components/home/BackgroundBanner";
import SEO from "../components/common/SEO";
import LazyImage from "../components/common/LazyImage";

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {
    slideInFromLeft,
    slideInFromRight,
    fadeInUp,
    stackIn,
    staggerFadeIn,
    parallaxEffect,
  } = useScrollAnimations();

  useEffect(() => {
    // Add a small delay to ensure lazy loading doesn't interfere with initial animations
    const timer = setTimeout(() => {
      // Home page scroll animations
      slideInFromLeft(".home-title-left");
      slideInFromRight(".home-title-right");
      fadeInUp(".home-subtitle");
      staggerFadeIn(".home-text-line", 0.1);
      stackIn(".home-section-card", 0.2);
      parallaxEffect(".home-parallax-bg", 0.3);

      // Trusted companies section animations
      slideInFromLeft(".trusted-companies-title", 0.2);
    }, 200);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      cleanupAnimations();
    };
  }, []);

  const handlePortfolioClick = () => {
    navigate("/portfolio");
  };

  return (
    <>
      <SEO
        title="홈"
        description="비디오크루는 전문적인 영상 제작 서비스를 제공합니다. 기업 홍보영상, 광고영상, 제품 소개영상 등 다양한 영상 콘텐츠를 제작합니다. 창의적인 스토리텔링과 고품질 영상으로 고객의 비즈니스를 성장시킵니다."
        keywords="영상제작, 비디오제작, 기업홍보영상, 광고영상, 제품소개영상, 스토리텔링, 영상편집, 촬영, 비디오크루"
      />
      <div ref={containerRef} className="relative overflow-hidden">
        <HeroSection />
        <section className="bg-black text-white w-full px-4 xs:px-6 md:px-8 lg:px-6 py-12 xs:py-16 md:py-20 home-section-card">
          <div className="max-w-[1248px] mx-auto flex flex-col md:flex-row justify-between items-start md:space-x-8 lg:space-x-12 xl:space-x-16 space-y-8 md:space-y-0">
            {/* Left Title Block — responsive width adjustments */}
            <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[350px] text-center md:text-left home-title-left">
              <p className="text-sm xs:text-base md:text-lg text-gray-400 mb-2 home-subtitle">
                비디오크루의 차별점
              </p>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold leading-snug">
                영상 제작, 어떻게
                <br />
                하고 계신가요?
              </h2>
            </div>

            {/* Right Paragraph Block — responsive text sizing */}
            <div className="md:pl-28 w-full md:flex-1 text-sm xs:text-base sm:text-lg md:text-base lg:text-lg text-gray-300 leading-relaxed text-center md:text-right home-title-right">
              <div className="home-text-line">
                비디오크루는 단순한 영상 제작을 넘어, 강력한 스토리텔링과
                독창적인
              </div>
              <div className="home-text-line">
                시각적 표현으로 고객의 메시지설명력을 높여주는 비디오 콘텐츠
                전문
              </div>
              <div className="home-text-line">
                그룹입니다. 기획부터 촬영, 편집, 그리고 최종 결과물에
                이르기까지, 각
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
        <LazyImage
          src="/imgs/Image.webp"
          alt="비디오크루 서비스 섹션 구분 디자인 이미지"
          className="w-full h-auto object-cover mb-4 xs:mb-6 home-parallax-bg relative z-0
               -mt-16 xs:-mt-20 sm:-mt-24 md:-mt-20 lg:-mt-24 xl:-mt-28"
          onImageLoad={() => {
            // Re-trigger parallax animations after image loads
            refreshGSAPAnimations(".home-parallax-bg");
          }}
        />

        <div className="home-section-card">
          <PortfolioScroller />
        </div>
        {/* Browse Portfolio Button */}
        <div className="w-full flex justify-center my-6 xs:my-8 sm:my-10 home-section-card relative z-20">
          <div className="max-w-[1248px] w-full flex justify-center">
            <button
              onClick={handlePortfolioClick}
              className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold py-2.5 xs:py-3 px-6 xs:px-8 rounded-full transition duration-300 text-sm xs:text-base relative z-10"
            >
              포트폴리오 둘러보기
            </button>
          </div>
        </div>

        {/* Decorative Separator Image after PortfolioScroller */}
        <LazyImage
          src="/imgs/Image-1.webp"
          alt="비디오크루 포트폴리오 섹션 구분 디자인 이미지"
          className="w-full h-auto object-cover -mt-4 xs:-mt-6 sm:mt-8 md:mt-10 lg:mt-14 home-parallax-bg"
          onImageLoad={() => {
            // Re-trigger parallax animations after image loads
            refreshGSAPAnimations(".home-parallax-bg");
          }}
        />

        {/* Trusted by Companies Text Block */}
        <div className="w-full text-center text-white -mt-2 xs:-mt-4 sm:-mt-20 md:-mt-24 lg:-mt-28 mb-12 xs:mb-16 md:mb-20 px-4 xs:px-6 home-section-card">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-snug home-title-left trusted-companies-title">
            이미 수많은 기업이 <br />
            비디오크루와 함께 하고 있습니다.
          </h2>
        </div>

        {/* Full-Width Separator Image */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-12 xs:mt-14 md:mt-16 mb-8 xs:mb-10 md:mb-12">
          <LazyImage
            src="/imgs/Frame 430.webp"
            alt="비디오크루 신뢰할 수 있는 기업들 섹션 구분 디자인 이미지"
            className="w-full h-auto object-cover home-parallax-bg"
            onImageLoad={() => {
              // Re-trigger parallax animations after image loads
              refreshGSAPAnimations(".home-parallax-bg");
            }}
          />
        </div>

        <div className="home-section-card">
          <BackgroundBanner />
        </div>
      </div>
    </>
  );
};

export default Home;
