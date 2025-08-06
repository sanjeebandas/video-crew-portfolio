const HeroSection = () => {
  return (
    <section className="relative w-full h-screen bg-black text-white">
      {/* Banner Image */}
      <img
        src="/imgs/Banner-Image.webp"
        alt="Video Crew Banner"
        className="absolute top-0 left-0 w-full h-full object-cover object-[center_30%] md:object-top z-0 -translate-y-3 md:-translate-y-5"
      />

      {/* HeroSection Content */}
      <div className="relative z-20 flex flex-col h-[80vh] justify-end items-center md:items-start text-center md:text-left">
        <div className="max-w-[1248px] mx-auto px-4 -mb-8 w-full">
          <h1 className="text-sm opacity-75 md:text-2xl lg:text-xl font-normal leading-snug max-w-3xl mx-auto md:mx-0">
            "이번엔 정말 제대로 된 업체를 찾고 싶다...""
            <br />
            혹시 이런 마음으로 여기까지 오셨나요?
            <br />
            축하드립니다!
          </h1>
          <p className="mt-6 text-lg md:text-3xl lg:text-4xl font-bold text-white mx-auto md:mx-0">
            비디오크루가 정답입니다!
          </p>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center md:justify-start space-x-2 mt-8">
            <span className="w-4 h-4 border-2 border-white rounded-full"></span>
            <span className="w-3 h-3 border border-white rounded-full opacity-40"></span>
            <span className="w-3 h-3 border border-white rounded-full opacity-40"></span>
            <span className="w-3 h-3 border border-white rounded-full opacity-40"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
