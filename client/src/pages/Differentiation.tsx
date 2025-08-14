import { useEffect, useRef } from "react";
import { useScrollAnimations, cleanupAnimations } from "../utils/animations";
import DifferentiationHero from "../components/differentiation/DifferentiationHero";
import WhyVideoCrewBoxes from "../components/differentiation/WhyVideoCrewBoxes;";
import DifferentiationFeatureSection from "../components/differentiation/DifferentiationFeatureSection";
import DifferentiationBackgroundBanner from "../components/differentiation/DifferentiationBackgroundBanner";

const Differentiation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slideInFromLeft, slideInFromRight, staggerFadeIn, stackIn } = useScrollAnimations();

  useEffect(() => {
    // Differentiation page scroll animations
    slideInFromLeft(".diff-title-left");
    slideInFromRight(".diff-title-right");
    staggerFadeIn(".diff-text-line", 0.1);
    stackIn(".diff-feature-section", 0.4);

    // Cleanup on unmount
    return () => {
      cleanupAnimations();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <section className="w-full bg-black text-white">
        <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-0 py-10 md:py-14">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            {/* Left: Title Block */}
            <div className="flex-1 diff-title-left">
              <h4 className="text-sm md:text-base font-medium opacity-70 mb-2">
                왜 비디오크루를 선택해야 할까요?
              </h4>
              <h2 className="text-2xl md:text-4xl font-bold">
                비디오크루만의 특별함
              </h2>
            </div>

            {/* Right: Paragraph Block */}
            <div className="flex-1 max-w-xl text-sm md:text-base font-medium leading-relaxed opacity-90 md:text-right diff-title-right">
              <div className="diff-text-line">
                컨설턴트가 스토리를 입히고, 전문 디자이너와 촬영감독, PD가 1:1
                맞춤 설계된 영상을 제공하며, 차별화된 스토리와 다양한 선택지를
                제시합니다.
              </div>
            </div>
          </div>
        </div>
      </section>
      <DifferentiationHero />
      <WhyVideoCrewBoxes />
      <div className="diff-feature-section">
        <DifferentiationFeatureSection
          number="01"
          title="A/B 시안 제공"
          description="동일한 콘텐츠라도 다양한 가능성을 고려하는 것이 중요합니다. 디자인크루는 서로 다른 2가지 영상 시안을 제공하여 선택의 폭을 넓혀드립니다. 샘플 파일을 통해 본 작업 전에 방향성을 명확히 확인할 수 있습니다."
          imageUrl="imgs/differentiation/Frame 425.webp"
        />
      </div>
      <div className="diff-feature-section">
        <DifferentiationFeatureSection
          number="02"
          title="100% 투명한 정찰제"
          description="사전에 협의를 통해서 명확하게 예측 가능한 견적을 제공합니다..."
          imageUrl="imgs/differentiation/Frame 426.webp"
          reverse
        />
      </div>
      <div className="diff-feature-section">
        <DifferentiationFeatureSection
          number="03"
          title="100% 고객사 맞춤형 제작"
          description="우리는 찍어내듯 만드는 틀에 박힌 영상 제작을 단호히 거부합니다. 비디오크루의 모든 영상은 고객님의 고유한 브랜드 아이덴티티, 타깃 시청자의 특성, 전달하고자 하는 핵심 메시지에 맞춰 오직 하나뿐인 '오리지널 콘텐츠'로 탄생합니다."
          imageUrl="imgs/differentiation/Frame 427.webp"
        />
      </div>

      <div className="diff-feature-section">
        <DifferentiationFeatureSection
          number="04"
          title="결과에 대한 자신감"
          description="100% 고객 만족 책임 완본제! 비디오크루는 제공하는 영상의 퀄리티와 고객 만족에 대해 업계 최고 수준의 자신감을 가지고 있습니다. 만약 최종적으로 전달된 영상이 사전에 정의된 기획 의도 및 약속된 기준에서 현저히 벗어나 고객님께서 만족하지 못하실 경우…"
          imageUrl="imgs/differentiation/Frame 398.webp"
          reverse
        />
      </div>
      <DifferentiationBackgroundBanner />
    </div>
  );
};

export default Differentiation;
