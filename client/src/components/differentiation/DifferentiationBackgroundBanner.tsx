import { useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";

const DifferentiationBackgroundBanner = () => {
  const { slideInFromLeft, fadeInUp } = useScrollAnimations();

  useEffect(() => {
    // Background banner animations
    slideInFromLeft(".diff-banner-title");
    fadeInUp(".diff-banner-button");
  }, []);

  return (
    <section
      className="mt-14 relative w-full h-auto py-16 bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/imgs/Frame.webp')" }}
    >
      <div className="w-full max-w-[1248px] px-6 text-center flex flex-col items-center justify-center gap-6">
        <h2 className="diff-banner-title text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
          업계 최고 수준의 맞춤형 영상 콘텐츠
          <br />
          비디오크루와 함께하세요!
        </h2>
        <button className="diff-banner-button bg-blue-600 hover:bg-blue-800 hover:scale-110 hover:shadow-lg transition-all duration-300 ease-out px-6 py-2 rounded-full text-sm font-semibold">
          문의하기
        </button>
      </div>
    </section>
  );
};

export default DifferentiationBackgroundBanner;
