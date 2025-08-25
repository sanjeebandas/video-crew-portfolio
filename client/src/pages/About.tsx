import { useEffect, useRef } from "react";
import { useScrollAnimations, cleanupAnimations, refreshGSAPAnimations } from "../utils/animations";
import AboutGrid from "../components/about/AboutGrid";
import AboutHero from "../components/about/AboutHero";
import AboutWorkCultureGrid from "../components/about/AboutWorkCultureGrid";
import SEO from "../components/common/SEO";
import LazyImage from "../components/common/LazyImage";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    slideInFromLeft,
    slideInFromRight,
    fadeInUp,
    staggerFadeIn,
    stackIn,
    parallaxEffect,
  } = useScrollAnimations();

  useEffect(() => {
    // Add a small delay to ensure lazy loading doesn't interfere with initial animations
    const timer = setTimeout(() => {
      // About page scroll animations
      slideInFromLeft(".about-title-left");
      slideInFromRight(".about-title-right");
      staggerFadeIn(".about-text-line", 0.1);
      parallaxEffect(".about-separator", 0.3);
      fadeInUp(".about-section-title");
      staggerFadeIn(".about-section-text", 0.1);
    }, 200);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      cleanupAnimations();
    };
  }, []);
  
  return (
    <>
      <SEO 
        title="회사 소개"
        description="비디오크루는 스토리로 말하는 영상 콘텐츠를 제작하는 전문 회사입니다. 브랜드 스토리를 강력하고 인상적인 모습의 이야기로 만들어내는 우리만의 비전과 Core Value를 소개합니다."
        keywords="비디오크루, 회사소개, 영상제작회사, 브랜드스토리, Core Value, Work Culture, 영상콘텐츠제작"
      />
      <div ref={containerRef} className="relative overflow-hidden">
        <section className="bg-black text-white w-full px-6 py-12 md:py-16 lg:py-20">
          <div className="max-w-[1248px] mx-auto flex flex-col md:flex-row justify-between items-start md:space-x-8 lg:space-x-12 space-y-10 md:space-y-0">
            {/* Left Title Block */}
            <div className="w-full md:flex-1 text-center md:text-left about-title-left">
              <p className="text-sm text-gray-400 mb-2">Who we are, Video Crew</p>
              <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold leading-snug">
                스토리로 말하는 영상 콘텐츠,
                <br />
                시선을 사로잡는 영상,
                <br />더 이상 고민하지 마세요!
              </h2>
            </div>

            {/* Right Paragraph Block */}
            <div className="w-full md:flex-1 text-sm md:text-sm lg:text-base text-gray-300 leading-relaxed text-center md:text-justify md:mt-6 lg:mt-8 about-title-right">
              <div className="about-text-line">
                우리는 영상이 단순히 기술적인 가치가 있다고 생각하지 않습니다.
                우리에게는 각각 걸어온 하나의 경험을 나타냅니다. 비디오크루는,
                브랜드 스토리를 강력하고 인상적인 모습의 이야기로 일련의 작업물을
                거쳐 제작한 내용들이 우리가 가지고 있는 비전입니다.
              </div>
              <div className="about-text-line">
                "모든 프로젝트에 가치를 담아" 고객과 함께 성장하는 파트너가
                되겠습니다.
              </div>
            </div>
          </div>
        </section>

        {/* HeroSection of About Page */}
        <AboutHero />
        <div className="w-full bg-black overflow-hidden">
          <div className="max-w-[1248px] mx-auto px-6 md:px-4 lg:px-0 mt-4 sm:mt-6 md:mt-6 lg:mt-8">
            <LazyImage
              src="/imgs/Frame 430.webp"
              alt="비디오크루 회사 소개 섹션 구분 디자인 이미지"
              className="w-full h-auto object-cover transform scale-[1.5] sm:scale-100 transition-transform duration-300 about-separator"
              onImageLoad={() => {
                // Re-trigger separator animations after image loads
                refreshGSAPAnimations(".about-separator");
              }}
            />
          </div>
        </div>

        {/* Decorative Centered Separator Image */}
        <div className="w-full mt-4 sm:mt-6 md:mt-6 lg:mt-8 md:-mt-8 lg:-mt-10">
          <LazyImage
            src="/imgs/Image.webp"
            alt="비디오크루 Core Value 섹션 구분 디자인 이미지"
            className="w-full h-auto object-cover about-separator"
            onImageLoad={() => {
              // Re-trigger separator animations after image loads
              refreshGSAPAnimations(".about-separator");
            }}
          />
        </div>

        {/* Core Value Text Block */}
        <div className="w-full px-6">
          <div className="max-w-[1248px] mx-auto text-center text-white mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-2 leading-snug about-section-title">
              Core Value
            </h2>
            <div className="about-section-text text-sm sm:text-base md:text-base lg:text-lg text-gray-400 leading-relaxed">
              <div className="about-text-line">
                당신의 이야기에 생명을 불어넣는 영상,
              </div>
              <div className="about-text-line block sm:hidden">
                비디오크루가 만듭니다.
              </div>
              <div className="about-text-line">
                모든 프레임에 가치를 담다, 비디오크루
              </div>
            </div>
          </div>
        </div>
        {/* About Grid */}
        <AboutGrid />
        <LazyImage
          src="/imgs/Image-1.webp"
          alt="비디오크루 Work Culture 섹션 구분 디자인 이미지"
          className="w-full h-auto object-cover -mt-10 sm:-mt-10 about-separator"
          onImageLoad={() => {
            // Re-trigger separator animations after image loads
            refreshGSAPAnimations(".about-separator");
          }}
        />
        {/* Work Culture Text Block */}
        <div className="w-full px-6 md:-mt-24 lg:-mt-32">
          <div className="max-w-[1248px] mx-auto text-center text-white mb-6">
            <h2 className="text-lg sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-2 leading-snug about-section-title">
              Work Culture
            </h2>
            <div className="about-section-text text-sm sm:text-base md:text-base lg:text-lg text-gray-400 leading-relaxed">
              <div className="about-text-line">
                비디오크루의 업무 문화는 여러 차원에서 뛰어난 크리에이터들이
                그들의 열정을 바탕으로 합니다.
              </div>
            </div>
          </div>
        </div>
        <AboutWorkCultureGrid />
      </div>
    </>
  );
};

export default About;
