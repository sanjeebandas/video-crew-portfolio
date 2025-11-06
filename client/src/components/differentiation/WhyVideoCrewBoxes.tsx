import { useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";

const WhyVideoCrewBoxes = () => {
  const { slideUpFadeIn } = useScrollAnimations();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Using slideUpFadeIn for cards with slower stagger for better visibility
      slideUpFadeIn(".diff-why-box", {
        stagger: 0.25, // 250ms delay - slower to see each card animate
        duration: 0.6, // 0.6s duration - slightly longer for smoother effect
        ease: "power1.out", // Smooth easing
        scrollTrigger: {
          start: "top 100%", // Adjusted trigger since header is removed - cards are positioned higher
          end: "bottom 25%",
          toggleActions: "play none none none", // No reverse animation
          markers: false, // Disable debug markers
          refreshPriority: -1, // Higher priority for mobile
        },
      });
    }, 50); // Small delay to ensure initial state is set

    return () => {
      clearTimeout(timer);
    };
  }, []);
  const items = [
    {
      title: "예산을 초과하는 추가 비용이 발생하진 않을까?",
      description:
        "추가 비용이 발생하지 않으며,\n처음부터 투명한 가격 제시합니다.",
    },
    {
      title: "기성 영상 템플릿에 내용을 끼워 맞추지는 않을까?",
      description:
        "맞춤형 제작 방식으로, 고객사의 니즈를 \n100% 반영한 독창적인 영상만을 제공합니다.",
    },
    {
      title: "진행 상황을 중간에 확인할 수 있을까?",
      description:
        "주기적 보고서 제공으로 \n프로젝트 진행 과정을 투명하게 공유합니다.",
    },
  ];

  return (
    <section className="w-full bg-black text-white">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-6 py-10 md:py-14">
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="diff-why-box bg-[#0A0A0A] w-full md:w-[397px] min-h-[192px] border border-neutral-800 p-6 hover:border-blue-400/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer opacity-0 translate-y-8"
            >
              <div className="w-full text-center flex flex-col justify-start h-full">
                <h3 className="text-base md:text-md font-semibold mb-2 leading-snug group-hover:text-blue-400 transition-colors duration-300 ease-out line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base font-medium text-muted-2 leading-relaxed group-hover:opacity-90 group-hover:text-gray-200 transition-all duration-300 ease-out line-clamp-3">
                  {item.description.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < item.description.split("\n").length - 1 && (
                        <br />
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyVideoCrewBoxes;
