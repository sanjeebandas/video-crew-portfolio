import { useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: "10+", label: "다년간의 경험" },
  { value: "100+", label: "누적 프로젝트 수" },
  { value: "100%", label: "고객 만족도" },
  { value: "90%", label: "프로젝트 재수주율" },
];

const BackgroundBanner = () => {
  const { staggerFadeIn } = useScrollAnimations();

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Background banner animations - all numbers fade up from bottom
    staggerFadeIn(".stat-item", 0.2);

    // Jackpot-style number counting animations
    const statElements = document.querySelectorAll(".stat-value");
    statElements.forEach((element: any, index) => {
      const targetValue = stats[index].value;
      const isPercentage = targetValue.includes("%");
      const hasPlus = targetValue.includes("+");
      const numericValue = parseInt(targetValue.replace(/[^0-9]/g, ""));

      // Set initial value to 0
      element.textContent = isPercentage ? "0%" : hasPlus ? "0+" : "0";

      gsap.to(element, {
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        onUpdate: function () {
          const progress = this.progress();
          const currentValue = Math.floor(numericValue * progress);
          if (isPercentage) {
            element.textContent = `${currentValue}%`;
          } else if (hasPlus) {
            element.textContent = `${currentValue}+`;
          } else {
            element.textContent = currentValue.toString();
          }
        },
        onComplete: function () {
          element.textContent = targetValue; // Ensure final value is exact
        },
      });
    });
  }, []);

  return (
    <section
      className="mt-16 xs:mt-20 sm:mt-24 relative w-full h-auto py-8 xs:py-10 bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/imgs/Frame.webp')" }}
    >
      <div className="w-full max-w-[1248px] px-4 xs:px-6 md:px-8 lg:px-6 flex flex-col sm:flex-row justify-between items-center text-center gap-y-6 xs:gap-y-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="stat-item flex-1"
          >
            <p className="stat-value text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-1">
              {stat.value}
            </p>
            <p className="text-xs xs:text-sm sm:text-base md:text-base lg:text-lg text-gray-200">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BackgroundBanner;
