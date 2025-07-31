import React from "react";

const images = [
  "/imgs/Group 41.webp",
  "/imgs/Group 42.webp",
  "/imgs/Group 43.webp",
  "/imgs/Group 43.webp",
  "/imgs/Group 44.webp",
  "/imgs/Group 45.webp",
  "/imgs/Group 46.webp",
  "/imgs/Group 48.webp",
];

const PortfolioScroller = () => {
  return (
    <section className="bg-black pt-0 pb-12 overflow-hidden w-full">
      {/* Text Block */}
      <div className="w-full px-6">
        <div className="max-w-[1248px] mx-auto text-center text-white mb-6">
          <h2 className="text-lg sm:text-3xl md:text-4xl font-bold mb-2 leading-snug">
            비디오크루의 영상제작 사례
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            당신의 이야기에 생명을 불어넣는 영상,
            <br className="block sm:hidden" />
            비디오크루가 만듭니다.
            <br />
            모든 프레임에 가치를 담다, 비디오크루
          </p>
        </div>
      </div>

      {/* Carousel Rows with responsive spacing */}
      <div className="space-y-4 sm:space-y-6 mt-12 sm:mt-24">
        {/* Row 1 - Left to Right */}
        <div className="flex gap-2 sm:gap-4 animate-scroll-left px-4 sm:px-0">
          {[...images, ...images].map((src, i) => (
            <img
              key={`row1-${i}`}
              src={src}
              alt={`scroll-1-${i}`}
              className="w-[220px] h-[130px] sm:w-[360px] sm:h-[201px] object-cover rounded-md flex-shrink-0"
            />
          ))}
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex gap-2 sm:gap-4 animate-scroll-right px-4 sm:px-0">
          {[...images, ...images].map((src, i) => (
            <img
              key={`row2-${i}`}
              src={src}
              alt={`scroll-2-${i}`}
              className="w-[220px] h-[130px] sm:w-[360px] sm:h-[201px] object-cover rounded-md flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioScroller;
