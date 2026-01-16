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
import InfiniteScroller from "../components/common/InfiniteScroller";
import ErrorBoundary from "../components/common/ErrorBoundary";

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { fadeInUp, slideUpFadeIn, stackIn, staggerFadeIn, parallaxEffect } =
    useScrollAnimations();

  useEffect(() => {
    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // Home page scroll animations - trigger earlier to eliminate blank gap after hero
      slideUpFadeIn(".home-title-left", {
        scrollTrigger: {
          start: "top 110%", // Trigger when element is still below viewport
        },
      });
      slideUpFadeIn(".home-title-right", {
        scrollTrigger: {
          start: "top 110%",
        },
      });
      fadeInUp(".home-subtitle", {
        scrollTrigger: {
          start: "top 110%",
        },
      });
      staggerFadeIn(".home-text-line", {
        scrollTrigger: {
          start: "top 115%",
        },
      });
      stackIn(".home-section-card", {
        scrollTrigger: {
          start: "top 105%", // Trigger as soon as element enters viewport area
        },
      });
      parallaxEffect(".home-parallax-bg", 0.3);

      // Trusted companies section animations
      slideUpFadeIn(".trusted-companies-title", {
        scrollTrigger: {
          start: "top 110%", // Trigger much earlier - when element is 120% down the viewport
        },
      }); // Bottom to up animation
    }, 120); // Reduced from 200ms to 120ms

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
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("Home page error:", error, errorInfo);
          }}
        >
          <ErrorBoundary
            fallback={
              <div className="min-h-[400px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold mb-2">
                    홈페이지를 불러올 수 없습니다
                  </h3>
                  <p className="text-muted">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <HeroSection />
          </ErrorBoundary>

          <section className="bg-black text-white w-full px-4 xs:px-6 md:px-8 lg:px-6 py-12 xs:py-16 md:py-20 home-section-card">
            <div className="max-w-[1248px] mx-auto flex flex-col justify-center items-center space-y-8">
              {/* Left Title Block — responsive width adjustments */}
              <div className="w-full md:w-[450px] lg:w-[700px] xl:w-[850px] text-center home-title-left">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold leading-snug">
                  영상제작,
                  <br />
                  어떻게 하고 계신가요?
                </h2>
              </div>

              {/* Right Paragraph Block — responsive text sizing */}
              <div className="w-full max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] text-lg xs:text-lg sm:text-xl md:text-lg lg:text-xl text-muted leading-relaxed text-center home-title-right">
                <div className="home-text-line">
                  비디오크루는 단순한 영상 제작을 넘어, 강력한 스토리텔링과 독창적인 표현으로
                </div>
                <div className="home-text-line">
                  고객이 원하는 메시지의 설명력을 높여주는 비디오 콘텐츠 전문 그룹입니다.
                </div>
              </div>
            </div>
          </section>

          {/* This comes AFTER the paragraph block */}
          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    서비스 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-muted">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <div className="home-section-card relative z-10">
              <ServicesGrid />
            </div>
          </ErrorBoundary>

          {/* Decorative Separator Image after Services */}
          <LazyImage
            src="/imgs/Image.webp"
            alt="비디오크루 서비스 섹션 구분 디자인 이미지"
            className="w-full h-auto object-cover mb-0 home-parallax-bg relative z-0
                 -mt-16 xs:-mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32 xl:-mt-36"
            onImageLoad={() => {
              // Re-trigger parallax animations after image loads
              refreshGSAPAnimations(".home-parallax-bg");
            }}
          />

          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    포트폴리오 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-muted">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <div className="home-section-card -mt-4 xs:-mt-8 sm:-mt-10 md:-mt-12 lg:-mt-14 xl:-mt-22">
              <PortfolioScroller />
            </div>
          </ErrorBoundary>

          {/* Browse Portfolio Button */}
          <div className="w-full flex justify-center my-6 xs:my-8 sm:my-10 home-section-card relative z-20">
            <div className="max-w-[1248px] w-full flex justify-center">
              <button
                onClick={handlePortfolioClick}
                className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold py-4 px-14 rounded-full transition duration-300 text-lg relative z-10"
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
          <div className="w-full text-center text-white -mt-20 xs:-mt-24 sm:-mt-32 md:-mt-40 lg:-mt-72 mb-12 xs:mb-16 md:mb-24 px-4 xs:px-6 home-section-card">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-snug trusted-companies-title">
              이미 수많은 기업이 <br />
              비디오크루와 함께 하고 있습니다.
            </h2>
          </div>

          <ErrorBoundary
            fallback={
              <div className="min-h-[100px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    기업 로고 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <InfiniteScroller />
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="min-h-[200px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    통계 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <div className="home-section-card">
              <BackgroundBanner />
            </div>
          </ErrorBoundary>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Home;
