import { useEffect } from "react";
import { useScrollAnimations } from "../utils/animations";

const ProcessBanner = () => {
  const { slideUpFadeIn, fadeInUp, staggerFadeIn } =
    useScrollAnimations();

  useEffect(() => {
    // Process banner animations - matching Home page style
    const timer = setTimeout(() => {
      slideUpFadeIn(".process-title-left");
      slideUpFadeIn(".process-title-right");
      fadeInUp(".process-subtitle");
      staggerFadeIn(".process-text-line", 0.06);
    }, 120);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="w-full bg-black text-white">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-6 py-10 md:py-14">
        <div className="flex flex-col justify-center items-center space-y-8">
          {/* Left: Title Block */}
          <div className="text-center process-title-left">
            <h4 className="text-sm md:text-base text-muted mb-2 process-subtitle">
              영상제작 프로세스​
            </h4>
            <h2 className="text-2xl md:text-4xl font-bold">
              영상제작 프로세스​
            </h2>
          </div>

          {/* Right: Paragraph Block */}
          <div className="w-full text-sm md:text-base leading-relaxed text-muted text-center process-title-right">
            <div className="process-text-line">
              비디오크루만의 영상제작 프로세스를 통해 고객의 니즈에 부합하는
              최적의 콘텐츠를 디자인하여 제공합니다.​
            </div>
            <div className="process-text-line">
              *과업의 형태에 따라 프로세스는 변동될 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessBanner;
