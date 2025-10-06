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
  const { stackIn } = useScrollAnimations();
  const [imageErrors, setImageErrors] = useState<boolean[]>(
    new Array(services.length).fill(false)
  );

  useEffect(() => {
    stackIn(".service-card", 0.1);
  }, []);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <section className="w-full bg-black text-white px-4 xs:px-6 md:px-8 lg:px-6 py-12 xs:py-14 md:py-8">
      <div className="max-w-[1248px] mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 place-items-center">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="service-card relative w-[85vw] xs:w-[90vw] max-w-[280px] xs:max-w-[302px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[380px] xl:max-w-[402px] h-[180px] xs:h-[195px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[425px] rounded-md overflow-hidden shadow-md border border-white/10 transition-all duration-300 ease-out hover:-translate-y-2 xs:hover:-translate-y-3 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-400/20 hover:bg-blue-400/5"
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
            <div className="absolute bottom-0 left-0 w-full p-3 xs:p-4">
              <div className="flex flex-col justify-start gap-1.5 xs:gap-2 min-h-[8px] xs:min-h-[10px] sm:min-h-[60px] md:min-h-[80px] lg:min-h-[100px]">
                <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-white drop-shadow-sm">
                  {service.title}
                </h3>
                <p className="text-xs xs:text-sm sm:text-sm md:text-sm text-muted leading-snug md:leading-relaxed drop-shadow-sm whitespace-pre-line">
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
