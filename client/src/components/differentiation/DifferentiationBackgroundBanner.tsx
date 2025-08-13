const DifferentiationBackgroundBanner = () => {
  return (
    <section
      className="mt-14 relative w-full h-auto py-16 bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/imgs/Frame.webp')" }}
    >
      <div className="w-full max-w-[1248px] px-6 text-center flex flex-col items-center justify-center gap-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
          업계 최고 수준의 맞춤형 영상 콘텐츠
          <br />
          비디오크루와 함께하세요!
        </h2>
        <button className="bg-blue-600 hover:bg-blue-800 transition-colors px-6 py-2 rounded-full text-sm font-semibold">
          문의하기
        </button>
      </div>
    </section>
  );
};

export default DifferentiationBackgroundBanner;
