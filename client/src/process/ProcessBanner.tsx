import { useEffect } from "react";
import { useScrollAnimations } from "../utils/animations";

const ProcessBanner = () => {
  const { slideInFromLeft, staggerFadeIn, parallaxEffect } = useScrollAnimations();

  useEffect(() => {
    // Process banner animations
    slideInFromLeft(".process-banner-title");
    staggerFadeIn(".process-banner-text", 0.1);
    parallaxEffect(".process-banner-image", 0.3);
  }, []);

  return (
    <section className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:w-[1248px] lg:h-[570px] lg:mx-auto border border-white/20">
        {/* Left side - Text */}
        <div className="lg:col-span-2 bg-black text-white p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 process-banner-title">영상제작 프로세스</h1>
          <div className="process-banner-text text-gray-300 text-sm leading-relaxed mb-12">
            <div className="process-banner-text-line">
              비디오크루만의 영상제작 프로세스를 통해 고객의 니즈에 부합하는
            </div>
            <div className="process-banner-text-line">
              최적의 콘텐츠를 디자인하여 제공합니다.
            </div>
          </div>
          <p className="process-banner-text text-xs text-gray-500">
            *과업의 형태에 따라 프로세스는 변동될 수 있습니다.
          </p>
        </div>

        {/* Right side - Image */}
        <div className="lg:col-span-3 relative overflow-hidden">
          <img
            src="/imgs/process/Group 90.webp"
            alt="Process Banner"
            className="w-full h-full object-cover process-banner-image"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Title + Description */}
        <div className="bg-black text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 process-banner-title">영상제작 프로세스</h1>
          <div className="process-banner-text text-gray-300 text-sm leading-relaxed">
            <div className="process-banner-text-line">
              비디오크루만의 영상제작 프로세스를 통해 고객의 니즈에 부합하는
            </div>
            <div className="process-banner-text-line">
              최적의 콘텐츠를 디자인하여 제공합니다.
            </div>
          </div>
        </div>

        {/* Image box with only image border */}
        <div className="bg-black px-6 pb-6">
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-white/20">
            <img
              src="/imgs/process/Group 90.webp"
              alt="Process Banner"
              className="w-full h-full object-cover process-banner-image"
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-black text-white p-6 flex flex-col justify-center text-center">
          <p className="text-xs text-gray-500 process-banner-text">
            *과업의 형태에 따라 프로세스는 변동될 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessBanner;
