import { useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";

const WhyVideoCrewBoxes = () => {
  const { staggerFadeIn } = useScrollAnimations();

  useEffect(() => {
    // WhyVideoCrewBoxes animations
    staggerFadeIn(".diff-why-box", 0.2);
  }, []);
  const items = [
    {
      title: "예산을 초과하는 추가 비용이 발생하진 않을까?",
      description: "추가 비용이 발생하지 않으며, 처음부터 투명한 가격을 제시",
    },
    {
      title: "기성 영상 템플릿에 내용을 끼워 맞추지는 않을까?",
      description:
        "맞춤형 제작 방식으로, 고객사만 니즈를 100% 반영한 독창적인 영상만을 제공",
    },
    {
      title: "진행 상황을 중간에 확인할 수 있을까?",
      description: "주기적 보고지 제공으로, 프로젝트 진행 과정을 투명하게 공유",
    },
  ];

  return (
    <section className="w-full bg-black text-white">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-0 py-10 md:py-14">
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="diff-why-box bg-[#0A0A0A] w-full md:w-[397px] h-[192px] border border-neutral-800 p-6 hover:border-blue-400/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer"
            >
              <div className="w-[85%]">
                <h3 className="text-base md:text-md font-semibold mb-2 leading-snug group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base font-medium opacity-70 leading-relaxed group-hover:opacity-90 group-hover:text-gray-200 transition-all duration-300 ease-out">
                  {item.description}
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
