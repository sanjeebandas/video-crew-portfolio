const services = [
  {
    title: "Creative Solutions",
    description:
      "틀에 박힌 형식이 아닌,메시지의 최적화를 돕는\n독창적인 아이디어를 제시합니다.",
    image: "/imgs/image 3.webp",
  },
  {
    title: "Professional Quality",
    description:
      "대기업과 협업했던 전문 컨설턴트들이 기획하며, \n최신 장비와 기술력을 바탕으로\n모든 프로젝트에 최상의 퀄리티를 보장합니다.",
    image: "/imgs/image 2.webp",
  },
  {
    title: "All-in-One Service",
    description:
      "복잡한 영상 제작 과정,비디오크루에서는 \n기획부터 최종 발표까지 \n원스톱으로 책임져 드립니다.",
    image: "/imgs/image 1.webp",
  },
];

import { useEffect, useState } from "react";
import { useScrollAnimations } from "../../utils/animations";

const ServicesGrid = () => {
  const { slideUpFadeIn } = useScrollAnimations();
  const [imageErrors, setImageErrors] = useState<boolean[]>(
    new Array(services.length).fill(false)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Using slideUpFadeIn for cards with slower stagger for better visibility
      slideUpFadeIn(".service-card", {
        stagger: 0.25, // 250ms delay - slower to see each card animate
        duration: 0.6, // 0.6s duration - slightly longer for smoother effect
        ease: "power1.out", // Smooth easing
        scrollTrigger: {
          start: "top 95%", // Trigger earlier to match sub-hero content timing
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

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <section className="w-full bg-black text-white px-4 xs:px-6 md:px-8 lg:px-6 3xl:px-8 py-12 xs:py-14 md:py-8">
      {/* 
        Ultra-wide strategy: 
        - Keep max-width constraint for content rail (expands slightly on larger screens)
        - Scale gap/spacing between cards rather than card width
        - Cards remain balanced, not stretched edge-to-edge
      */}
      <div className="max-w-[1248px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 2xl:gap-8 3xl:gap-10 place-items-center">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="service-card relative w-[85vw] xs:w-[90vw] max-w-[280px] xs:max-w-[302px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[380px] xl:max-w-[402px] 2xl:max-w-[420px] 3xl:max-w-[480px] h-[180px] xs:h-[195px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[425px] 2xl:h-[450px] 3xl:h-[500px] rounded-md overflow-hidden shadow-md border border-white/10 transition-all duration-300 ease-out hover:-translate-y-2 xs:hover:-translate-y-3 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-400/20 hover:bg-blue-400/5 opacity-0 translate-y-8"
          >
            {/* Image fills the card */}
            {!imageErrors[idx] ? (
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(idx)}
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400">이미지 로드 실패</p>
                </div>
              </div>
            )}

            {/* Very subtle overlay for text readability */}
            <div className="absolute bottom-0 left-0 w-full p-4 xs:p-5 sm:p-5 md:p-6 lg:p-7 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              <div className="flex flex-col gap-2 xs:gap-2.5 md:gap-3 min-h-[60px] xs:min-h-[70px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px]">
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-sm flex-shrink-0">
                  {service.title}
                </h3>
                <p className="text-xs xs:text-sm sm:text-sm md:text-base text-muted leading-snug md:leading-relaxed drop-shadow-sm whitespace-pre-line flex-grow">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
