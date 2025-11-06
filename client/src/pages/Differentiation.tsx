import { useEffect, useRef } from "react";
import {
  useScrollAnimations,
  cleanupAnimations,
  refreshGSAPAnimations,
} from "../utils/animations";
import WhyVideoCrewBoxes from "../components/differentiation/WhyVideoCrewBoxes";
import DifferentiationFeatureSection from "../components/differentiation/DifferentiationFeatureSection";
import DifferentiationBackgroundBanner from "../components/differentiation/DifferentiationBackgroundBanner";
import SEO from "../components/common/SEO";
import ErrorBoundary from "../components/common/ErrorBoundary";
import LazyImage from "../components/common/LazyImage";

const Differentiation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slideUpFadeIn, fadeInUp, staggerFadeIn, stackIn } =
    useScrollAnimations();

  useEffect(() => {
    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // Differentiation page scroll animations - matching ProcessBanner style
      slideUpFadeIn(".diff-title-left");
      slideUpFadeIn(".diff-title-right");
      fadeInUp(".diff-subtitle");
      staggerFadeIn(".diff-text-line", 0.06); // Reduced stagger delay
      stackIn(".diff-feature-section", 0.2); // Reduced stagger delay
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
        title="차별화"
        description="비디오크루만의 특별한 차별화 포인트를 소개합니다. A/B 시안 제공, 100% 투명한 정찰제, 고객사 맞춤형 제작, 결과에 대한 자신감 등 다른 업체와 차별화된 서비스를 제공합니다."
        keywords="비디오크루차별화, AB시안제공, 투명한정찰제, 맞춤형제작, 고객만족, 영상제작차별화, 전문영상제작"
      />
      <div ref={containerRef} className="relative overflow-hidden">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("Differentiation page error:", error, errorInfo);
          }}
        >
          <section className="w-full bg-black text-white">
            <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-6 py-10 md:py-14">
              <div className="flex flex-col justify-center items-center space-y-8">
                {/* Left: Title Block */}
                <div className="w-full md:w-[450px] lg:w-[700px] xl:w-[850px] text-center diff-title-left">
                  <h4 className="text-xl xs:text-2xl sm:text-3xl md:text-2xl lg:text-4xl text-muted mb-2 diff-subtitle">
                  Why choose Video Crew?

                  </h4>
                  <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold">
                    비디오크루만의 특별함
                  </h2>
                </div>

                {/* Right: Paragraph Block */}
                <div className="w-full max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] text-lg xs:text-lg sm:text-xl md:text-lg lg:text-xl leading-relaxed text-muted text-center diff-title-right">
                  <div className="diff-text-line">
                    컨설턴트가 스토리를 입히고, 전문 디자이너와 촬영감독, PD가
                    1:1 맞춤 설계된 영상을 제공하며, 차별화된 스토리와 다양한
                    선택지를 제시합니다.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ErrorBoundary
            fallback={
              <div className="min-h-[200px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    차별화 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-muted">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <WhyVideoCrewBoxes />
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    A/B 시안 제공 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <div className="diff-feature-section">
              <DifferentiationFeatureSection
                number="01"
                title="A/B 시안 제공"
                description="동일한 콘텐츠라도 다양한 가능성을 고려하는 것이 중요합니다. 디자인크루는 서로 다른 2가지 영상 시안을 제공하여 선택의 폭을 넓혀드립니다. 샘플 파일을 통해 본 작업 전에 방향성을 명확히 확인할 수 있습니다."
                imageUrl="imgs/differentiation/Frame 425.webp"
              />
            </div>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    투명한 정찰제 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <div className="diff-feature-section">
              <DifferentiationFeatureSection
                number="02"
                title="100% 투명한 정찰제"
                description="사전에 협의를 통해서 명확하게 예측 가능한 견적을 제공합니다."
                imageUrl="imgs/differentiation/Frame 426.webp"
                reverse
              />
            </div>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    맞춤형 제작 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <div className="diff-feature-section">
              <DifferentiationFeatureSection
                number="03"
                title="100% 고객사 맞춤형 제작"
                description="우리는 찍어내듯 만드는 틀에 박힌 영상 제작을 단호히 거부합니다. 비디오크루의 모든 영상은 고객님의 고유한 브랜드 아이덴티티, 타깃 시청자의 특성, 전달하고자 하는 핵심 메시지에 맞춰 오직 하나뿐인 '오리지널 콘텐츠'로 탄생합니다."
                imageUrl="imgs/differentiation/Frame 427.webp"
              />
            </div>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    결과 자신감 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <div className="diff-feature-section">
              <DifferentiationFeatureSection
                number="04"
                title="결과에 대한 자신감"
                description="비디오크루는 제공하는 영상의 퀄리티와 고객 만족에 대해 업계 최고 수준의 자신감을 가지고 있습니다. 만약 최종적으로 전달된 영상이 사전에 정의된 기획 의도 및 약속된 기준에서 현저히 벗어나 고객님께서 만족하지 못하실 경우, 만족하실 때까지 재수정해드립니다."
                imageUrl="imgs/differentiation/diff_feature_image.webp"
                reverse
              />
            </div>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="min-h-[200px] flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    문의 섹션을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <DifferentiationBackgroundBanner />
          </ErrorBoundary>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Differentiation;
