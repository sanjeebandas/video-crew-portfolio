import React from "react";

type Props = {};

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

const AboutWorkCultureGrid = (props: Props) => {
  return (
    <section className="w-full bg-black text-white px-6 py-16">
      <div className="max-w-[1248px] mx-auto">
        {/* Desktop Layout */}
        <div className="hidden min-[1024px]:grid grid-cols-2 gap-6">
          {/* Top Row - Two Cards */}
          <div className="grid grid-cols-2 gap-6 col-span-2">
            {workCultureItems.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="relative w-[613px] h-[548px] overflow-hidden shadow-md border border-white/10 transition-transform duration-300 ease-in-out hover:-translate-y-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-gray-300 uppercase tracking-wide">
                      {item.subtitle}
                    </p>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - One Large Card */}
          <div className="col-span-2">
            <div className="relative w-[1248px] h-[560px] overflow-hidden shadow-md border border-white/10 transition-transform duration-300 ease-in-out hover:-translate-y-3">
              <img
                src={workCultureItems[2].image}
                alt={workCultureItems[2].title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-300 uppercase tracking-wide">
                    {workCultureItems[2].subtitle}
                  </p>
                  <h3 className="text-xl font-bold mb-2">
                    {workCultureItems[2].title}
                  </h3>
                  <p className="text-base text-gray-200 leading-relaxed max-w-2xl">
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
              className="relative w-[302px] h-[257px] min-[768px]:w-[360px] min-[768px]:h-[300px] rounded-lg overflow-hidden shadow-md border border-white/10 transition-transform duration-300 ease-in-out hover:-translate-y-3"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-300 uppercase tracking-wide">
                    {item.subtitle}
                  </p>
                  <h3 className="text-base font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-200 leading-snug">
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
