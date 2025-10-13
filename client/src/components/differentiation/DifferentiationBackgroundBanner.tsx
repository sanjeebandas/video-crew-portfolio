import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimations } from "../../utils/animations";

const DifferentiationBackgroundBanner = () => {
  const { slideUpFadeIn } = useScrollAnimations();
  const navigate = useNavigate();

  useEffect(() => {
    // Background banner animations with slideUpFadeIn
    const timer = setTimeout(() => {
      slideUpFadeIn(".diff-banner-title", {
        stagger: 0.25, // 250ms delay - slower to see each element animate
        duration: 0.6, // 0.6s duration - slightly longer for smoother effect
        ease: "power1.out", // Smooth easing
        scrollTrigger: {
          start: "top 85%", // Even earlier trigger for mobile
          end: "bottom 15%",
          toggleActions: "play none none none", // No reverse animation
          markers: false, // Disable debug markers
          refreshPriority: -1, // Higher priority for mobile
        },
      });
      slideUpFadeIn(".diff-banner-button", {
        stagger: 0.25, // 250ms delay - slower to see each element animate
        duration: 0.6, // 0.6s duration - slightly longer for smoother effect
        ease: "power1.out", // Smooth easing
        scrollTrigger: {
          start: "top 85%", // Even earlier trigger for mobile
          end: "bottom 15%",
          toggleActions: "play none none none", // No reverse animation
          markers: false, // Disable debug markers
          refreshPriority: -1, // Higher priority for mobile
        },
      });
    }, 50); // Small delay to ensure initial state is set

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <section className="mt-14 relative w-full h-auto py-16 flex items-center justify-center text-white mb-16">
      <div className="w-full max-w-[1248px] px-6 text-center flex flex-col items-center justify-center gap-6">
        <h2 className="diff-banner-title text-xl sm:text-2xl md:text-3xl font-semibold leading-snug opacity-0 translate-y-8">
          업계 최고 수준의 맞춤형 영상 콘텐츠
          <br />
          비디오크루와 함께하세요!
        </h2>
        <button
          onClick={handleContactClick}
          className="diff-banner-button bg-blue-600 hover:bg-blue-800 hover:scale-110 hover:shadow-lg transition-all duration-300 ease-out px-6 py-2 rounded-full text-sm font-semibold cursor-pointer opacity-0 translate-y-8"
        >
          문의하기
        </button>
      </div>
    </section>
  );
};

export default DifferentiationBackgroundBanner;
