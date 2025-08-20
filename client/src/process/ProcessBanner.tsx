import { useEffect } from "react";
import { useScrollAnimations } from "../utils/animations";

const ProcessBanner = () => {
  const { slideInFromLeft, staggerFadeIn, parallaxEffect } =
    useScrollAnimations();

  useEffect(() => {
    // Process banner animations
    slideInFromLeft(".process-banner-title");
    staggerFadeIn(".process-banner-text", 0.1);
    parallaxEffect(".process-banner-image", 0.3);
  }, []);

  return (
    <section className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex justify-center">
        <div className="grid grid-cols-5 w-[1248px] h-[570px] border border-white/20 overflow-hidden">
          {/* Left side - Text */}
          <div className="col-span-2 bg-black text-white px-12 py-16 flex flex-col justify-center h-full">
            <h1 className="text-5xl font-bold mb-6 leading-tight process-banner-title">
              영상제작 프로세스
            </h1>
            <p className="text-white/45 text-base leading-relaxed mb-4 process-banner-text">
              비디오크루만의 영상제작 프로세스를 통해 고객의 니즈에 부합하는
              <br />
              최적의 콘텐츠를 디자인하여 제공합니다.
            </p>
            <p className="text-xs text-white/45 mt-6 process-banner-text">
              *과업의 형태에 따라 프로세스는 변동될 수 있습니다.
            </p>
          </div>

          {/* Right side - Image */}
          <div className="col-span-3 h-full">
            <img
              src="/imgs/process/Group 90.webp"
              alt="Process Banner"
              className="w-full h-full object-cover process-banner-image"
            />
          </div>
        </div>
      </div>

      {/* Tablet Layout - Intermediate between mobile and desktop */}
      <div className="hidden md:flex lg:hidden justify-center">
        <div className="grid grid-cols-3 w-full max-w-[900px] h-[500px] border border-white/20 overflow-hidden">
          {/* Left side - Text */}
          <div className="col-span-1 bg-black text-white px-8 py-12 flex flex-col justify-center h-full">
            <h1 className="text-3xl font-bold mb-4 leading-tight process-banner-title">
              영상제작 프로세스
            </h1>
            <p className="text-white/45 text-sm leading-relaxed mb-3 process-banner-text">
              비디오크루만의 영상제작 프로세스를 통해 고객의 니즈에 부합하는
              <br />
              최적의 콘텐츠를 디자인하여 제공합니다.
            </p>
            <p className="text-xs text-white/45 mt-4 process-banner-text">
              *과업의 형태에 따라 프로세스는 변동될 수 있습니다.
            </p>
          </div>

          {/* Right side - Image */}
          <div className="col-span-2 h-full">
            <img
              src="/imgs/process/Group 90.webp"
              alt="Process Banner"
              className="w-full h-full object-cover process-banner-image"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="border border-white/20 rounded overflow-hidden w-full h-[462px]">
          {/* Text Content */}
          <div className="p-6 text-center">
            <h1 className="text-xl font-bold mb-4 process-banner-title">
              영상제작 프로세스
            </h1>
            <p className="text-white/45 text-sm leading-relaxed mb-2 process-banner-text">
              비디오크루만의 영상제작 프로세스를 통해 고객의 니즈에 부합하는
              최적의 콘텐츠를 디자인하여 제공합니다.
            </p>
            <p className="text-xs text-white/45 mb-12 process-banner-text p-4">
              *과업의 형태에 따라 프로세스는 변동될 수 있습니다.
            </p>
          </div>

          {/* Image */}
          <img
            src="/imgs/process/Group 90.webp"
            alt="Process Banner"
            className="w-full h-auto object-cover process-banner-image"
          />
        </div>
      </div>
    </section>
  );
};

export default ProcessBanner;
