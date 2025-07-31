import React from "react";

type Props = {};

const stats = [
  { value: "10+", label: "다년간의 경험" },
  { value: "100+", label: "누적 프로젝트 수" },
  { value: "100%", label: "고객 만족도" },
  { value: "90%", label: "프로젝트 재수주율" },
];

const BackgroundBanner = (props: Props) => {
  return (
    <section
      className="mt-14 relative w-full h-auto py-10 bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/imgs/Frame.webp')" }}
    >
      <div className="w-full max-w-[1248px] px-6 flex flex-col sm:flex-row justify-between items-center text-center gap-y-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex-1">
            <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm md:text-base text-gray-200">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BackgroundBanner;
