import { useEffect, useRef } from "react";
import { cleanupAnimations } from "../utils/animations";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProcessBanner from "../process/ProcessBanner";
import ProcessStep from "../process/ProcessStep";
import SEO from "../components/common/SEO";
import ErrorBoundary from "../components/common/ErrorBoundary";

const processSteps = [
  {
    id: "01",
    title: "상담 및 목표 설정",
    subtitle: "Consultation & Goal Setting",
    description:
      "비디오크루는 고객님의 입장에서 먼저 고민합니다. 영상 제작의 궁극적인 목적에 따라 브랜드 인지도 향상, 제품 판매 증진, 정보 전달과 기대 효과, 주요 타겟 시청자...",
    image: "imgs/process/Frame 395.webp",
    offsetY: "md:-mt-0",
  },
  {
    id: "02",
    title: "영상 기획 및 전략 수립",
    subtitle: "Video Planning & Strategy",
    description:
      "설정된 목표와 예비분석을 영상화 전략에 반영. 주요 스토리라인, 편집적인 흐름, 촬영컨셉을 구체화합니다...",
    image: "imgs/process/Frame 396.webp",
    offsetY: "md:-mt-92",
  },
  {
    id: "03",
    title: "촬영 준비 및 일정 조율",
    subtitle: "Pre-Production & Scheduling",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae erat at justo lacinia rutrum. Nulla facilisi. Fusce vel turpis a nulla malesuada tincidunt.",
    image: "imgs/process/Frame 397.webp",
    offsetY: "md:-mt-36",
  },
  {
    id: "04",
    title: "현장 촬영",
    subtitle: "On-Site Filming",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    image: "imgs/process/Frame 396-1.webp",
    offsetY: "md:-mt-92",
  },
  {
    id: "05",
    title: "편집 및 후반 작업",
    subtitle: "Editing & Post-Production",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.",
    image: "imgs/process/Frame 423.webp",
    offsetY: "md:-mt-28",
  },
  {
    id: "06",
    title: "최종 납품 및 피드백",
    subtitle: "Final Delivery & Feedback",
    description:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    image: "imgs/process/Frame 396-2.webp",
    offsetY: "md:-mt-96",
  },
];

const Process = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // Process page scroll animations - alternating left/right fade-in
      const processSteps = document.querySelectorAll(".process-step");

      processSteps.forEach((step, index) => {
        const isEven = index % 2 === 0; // 0, 2, 4 = left to right, 1, 3, 5 = right to left

        if (isEven) {
          // Left to right fade-in for even indices (0, 2, 4)
          gsap.fromTo(
            step,
            { x: -100, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8, // Reduced from 1.5s to 0.8s
              ease: "power2.out",
              scrollTrigger: {
                trigger: step,
                start: "top 85%", // More aggressive trigger
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
            }
          );
        } else {
          gsap.fromTo(
            step,
            { x: 100, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8, // Reduced from 1.5s to 0.8s
              ease: "power2.out",
              scrollTrigger: {
                trigger: step,
                start: "top 85%", // More aggressive trigger
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
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
        title="제작 프로세스"
        description="비디오크루의 전문적인 영상 제작 프로세스를 소개합니다. 상담 및 목표 설정부터 최종 납품까지, 체계적이고 전문적인 6단계 제작 과정으로 고품질 영상을 제작합니다."
        keywords="영상제작프로세스, 비디오제작과정, 상담목표설정, 영상기획, 촬영준비, 현장촬영, 편집후반작업, 최종납품, 비디오크루프로세스"
      />
      <div
        ref={containerRef}
        className="bg-black text-white relative overflow-hidden"
      >
        <ProcessBanner />
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Process page error:', error, errorInfo);
          }}
        >
          <div className="max-w-[1248px] mx-auto px-4 py-12 md:py-20 xl:py-32 flex flex-col gap-20 md:gap-28 xl:gap-32">
            {processSteps.map((step, index) => (
              <ErrorBoundary
                key={step.id}
                fallback={
                  <div className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-lg font-semibold mb-2">프로세스 단계 {step.id}을 불러올 수 없습니다</h3>
                      <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                    </div>
                  </div>
                }
              >
                <div className="process-step">
                  <ProcessStep
                    id={step.id}
                    title={step.title}
                    subtitle={step.subtitle}
                    description={step.description}
                    image={step.image}
                    reverse={index % 2 !== 0}
                    offsetY={step.offsetY}
                  />
                </div>
              </ErrorBoundary>
            ))}
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Process;
