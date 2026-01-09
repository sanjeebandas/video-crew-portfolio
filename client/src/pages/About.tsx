import { useEffect, useRef } from "react";
import {
  useScrollAnimations,
  cleanupAnimations,
  refreshGSAPAnimations,
} from "../utils/animations";
import AboutGrid from "../components/about/AboutGrid";

import AboutWorkCultureGrid from "../components/about/AboutWorkCultureGrid";
import SEO from "../components/common/SEO";
import LazyImage from "../components/common/LazyImage";
import ErrorBoundary from "../components/common/ErrorBoundary";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slideUpFadeIn, fadeInUp, staggerFadeIn, parallaxEffect } =
    useScrollAnimations();

  // Description content for the right paragraph block with line breaks
  const aboutDescription = [
    "비디오크루는 모든 프로젝트에 진정성을 담아",
    "고객의 메시지가 세상에 가장 효과적으로 전달될 수 있도록 창의적인 영상을 연구하고 실현합니다.",
    '"모든 프레임에 가치를 담아" 고객과 함께 성장하는 파트너가 되겠습니다."',
  ];

  useEffect(() => {
    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // About page scroll animations - matching Home page style
      slideUpFadeIn(".about-title-left");
      slideUpFadeIn(".about-title-right");
      fadeInUp(".about-subtitle");
      staggerFadeIn(".about-text-line", 0.06); // Reduced stagger delay
      parallaxEffect(".about-separator", 0.3);
      fadeInUp(".about-section-title", 0.06);
      staggerFadeIn(".about-section-text", 0.06); // Reduced stagger delay
    }, 120); // Reduced from 200ms to 120ms

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
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("About page error:", error, errorInfo);
          }}
        >
          <section className="bg-black text-white w-full px-4 xs:px-6 md:px-8 lg:px-6 py-12 xs:py-16 md:py-20 relative z-10">
            <div className="max-w-[1248px] mx-auto flex flex-col justify-center items-center space-y-8">
              {/* Left Title Block — responsive width adjustments */}
              <div className="w-full md:w-[450px] lg:w-[700px] xl:w-[850px] text-center about-title-left">
                <p className="text-xl xs:text-2xl sm:text-3xl md:text-2xl lg:text-4xl text-muted mb-2 about-subtitle">
                  Who we are, Video Crew
                </p>
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold leading-snug">
                  스토리로 말하는 영상, 시선을 사로잡는 영상
                  <br />더 이상 고민하지 마세요!
                </h2>
              </div>

              {/* Right Paragraph Block — responsive text sizing */}
              <div className="w-full max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] text-lg xs:text-lg sm:text-xl md:text-lg lg:text-xl text-muted leading-relaxed text-center about-title-right">
                {aboutDescription.map((line, index) => (
                  <div key={index} className="about-text-line">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Decorative Centered Separator Image */}
          <div className="w-full -mt-16 sm:mt-6 md:-mt-32 lg:-mt-44">
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
          <div className="w-full px-6 -mt-4 sm:-mt-12 md:-mt-14 lg:-mt-20">
            <div className="max-w-[1248px] mx-auto text-center text-white mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-2 leading-snug about-section-title">
                Core Value
              </h2>
              <div className="about-section-text text-sm sm:text-base md:text-base lg:text-lg text-muted leading-relaxed">
                <div className="about-text-line">
                  비디오크루가 지향하는 핵심가치는 고객중심, 문제해결,
                  솔직함으로
                </div>
                <div className="about-text-line block sm:hidden">
                  비디오크루가 만듭니다.
                </div>
                <div className="about-text-line">
                  항상 진정성 있게 고객을 대하는 것을 목표로 합니다.
                </div>
              </div>
            </div>
          </div>

          {/* About Grid */}
          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    Core Value 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-muted">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <AboutGrid />
          </ErrorBoundary>

          <LazyImage
            src="/imgs/Image-1.webp"
            alt="비디오크루 Work Culture 섹션 구분 디자인 이미지"
            className="w-full h-auto object-cover -mt-8 sm:mt-16 about-separator"
            onImageLoad={() => {
              // Re-trigger separator animations after image loads
              refreshGSAPAnimations(".about-separator");
            }}
          />

          {/* Work Culture Text Block */}
          <div className="w-full px-6 -mt-16 md:-mt-48 lg:-mt-72">
            <div className="max-w-[1248px] mx-auto text-center text-white mb-6">
              <h2 className="text-lg sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-2 leading-snug about-section-title">
                Work Culture
              </h2>
              <div className="about-section-text text-sm sm:text-base md:text-base lg:text-lg text-muted leading-relaxed">
                <div className="about-text-line">
                  비디오크루가 일하는 문화는
                </div>
                <div className="about-text-line">
                  Agile Performance, Effectiveness, ​Knowledge sharing을
                  기반으로 합니다.
                </div>
              </div>
            </div>
          </div>

          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    Work Culture 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-muted">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <AboutWorkCultureGrid />
          </ErrorBoundary>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default About;
