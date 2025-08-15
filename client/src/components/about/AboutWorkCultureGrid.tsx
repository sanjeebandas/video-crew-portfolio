const workCultureItems = [
  {
    title: "'Agile' Performance",
    subtitle: "효과적인 업무 처리 순서",
    description: "비디오크루는 결과 중심으로 유연하고 빠르게 대응합니다.",
    image: "imgs/about/Image/placeholder-2.webp",
  },
  {
    title: "Effectiveness",
    subtitle: "형식보다는 효과적 접근",
    description:
      "비디오크루는 업무에 지속적이면서 실용적인 접근 방식을 추구합니다.",
    image: "imgs/about/Image/placeholder-1.webp",
  },
  {
    title: "Knowledge Sharing",
    subtitle: "끊임없는 학습",
    description:
      "지식적에 열린 서비스를 제공하는 비디오 전문팀트들의 역량을 추진합니다.",
    image: "imgs/about/Image/placeholder.webp",
  },
];

import { useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";

const AboutWorkCultureGrid = () => {
  const { stackIn, staggerFadeIn } = useScrollAnimations();

  useEffect(() => {
    // Work culture grid animations
    stackIn(".work-culture-card", 0.1); // Desktop cards
    staggerFadeIn(".work-culture-mobile-card", 0.2); // Mobile cards
    
    // Animate inner texts with their respective cards
    staggerFadeIn(".work-culture-text", 0.1); // Desktop text elements
    staggerFadeIn(".work-culture-mobile-text", 0.2); // Mobile text elements
  }, []);

  return (
    <section className="w-full bg-black text-white px-6 py-16 -mt-10">
      <div className="max-w-[1248px] mx-auto">
        {/* Desktop Layout */}
        <div className="hidden min-[1024px]:grid grid-cols-2 gap-6">
          {/* Top Row - Two Cards */}
          <div className="grid grid-cols-2 gap-6 col-span-2">
            {workCultureItems.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="work-culture-card relative w-[613px] h-[548px] overflow-hidden shadow-md border border-white/10 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl hover:border-blue-400/30 group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                                 {/* Overlay */}
                 <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300 ease-out">
                   <div className="flex flex-col gap-2">
                     <p className="work-culture-text text-xs text-gray-300 uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                       {item.subtitle}
                     </p>
                     <h3 className="work-culture-text text-lg font-bold mb-2 group-hover:text-white transition-colors duration-300 ease-out">{item.title}</h3>
                     <p className="work-culture-text text-sm text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 ease-out">
                       {item.description}
                     </p>
                   </div>
                 </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - One Large Card */}
          <div className="col-span-2">
            <div className="work-culture-card relative w-[1248px] h-[560px] overflow-hidden shadow-md border border-white/10 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl hover:border-blue-400/30 group">
              <img
                src={workCultureItems[2].image}
                alt={workCultureItems[2].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
                             {/* Overlay */}
               <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300 ease-out">
                 <div className="flex flex-col gap-2">
                   <p className="work-culture-text text-xs text-gray-300 uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                     {workCultureItems[2].subtitle}
                   </p>
                   <h3 className="work-culture-text text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300 ease-out">
                     {workCultureItems[2].title}
                   </h3>
                   <p className="work-culture-text text-base text-gray-200 leading-relaxed max-w-2xl group-hover:text-gray-100 transition-colors duration-300 ease-out">
                     {workCultureItems[2].description}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="min-[1024px]:hidden grid grid-cols-1 gap-6 place-items-center">
          {workCultureItems.map((item, idx) => (
            <div
              key={idx}
              className="work-culture-mobile-card relative w-[302px] h-[257px] min-[768px]:w-[360px] min-[768px]:h-[300px] rounded-lg overflow-hidden shadow-md border border-white/10 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl hover:border-blue-400/30 group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
                             {/* Overlay */}
               <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300 ease-out">
                 <div className="flex flex-col gap-1">
                   <p className="work-culture-mobile-text text-xs text-gray-300 uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                     {item.subtitle}
                   </p>
                   <h3 className="work-culture-mobile-text text-base font-bold mb-1 group-hover:text-white transition-colors duration-300 ease-out">{item.title}</h3>
                   <p className="work-culture-mobile-text text-xs text-gray-200 leading-snug group-hover:text-gray-100 transition-colors duration-300 ease-out">
                     {item.description}
                   </p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutWorkCultureGrid;
