import React from "react";

type Props = {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
};

const PortfolioBanner = ({ currentFilter, setCurrentFilter }: Props) => {
  const categories = ["광고 · 홍보 영상", "이러닝 영상", "기업 행사 영상"];

  return (
    <section className="text-center py-16 px-4 md:px-8 lg:px-0">
      <div className="max-w-[1248px] mx-auto">
        <p className="text-sm tracking-[0.25em] text-white opacity-60 mb-2">
          PORTFOLIO
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-8">
          We Create Beautiful,
          <br />
          <span className="text-[#4D74FF]">Practical Works</span>
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {categories.map((label, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFilter(label)}
              className={`w-[268px] h-[27px] md:w-[274px] md:h-[70px] 
    text-xs md:text-xl rounded-full border transition
    ${
      currentFilter === label
        ? "bg-white text-black border-white"
        : "text-white border-white hover:bg-white hover:text-black"
    }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioBanner;
