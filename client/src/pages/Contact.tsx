import { useEffect, useRef } from "react";
import { useScrollAnimations, cleanupAnimations } from "../utils/animations";
import ContactForm from "../components/contact/ContactForm";
import SEO from "../components/common/SEO";
import ErrorBoundary from "../components/common/ErrorBoundary";

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slideUpFadeIn, fadeInUp, staggerFadeIn, stackIn } =
    useScrollAnimations();

  // Description content for the right paragraph block
  const contactDescription = [
    "비디오크루 서비스에 대해 궁금한 점이 있으시거나",
    "프로젝트에 대한 상의가 필요하신 경우 문의를 남겨 주시면 상세히 회신 드리겠습니다.",
  ];

  useEffect(() => {
    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // Contact page scroll animations - matching About page style
      slideUpFadeIn(".contact-title-left");
      slideUpFadeIn(".contact-title-right");
      fadeInUp(".contact-subtitle");
      staggerFadeIn(".contact-text-line", 0.06); // Reduced stagger delay
      stackIn(".contact-form-row", 0.06); // Reduced stagger delay
      fadeInUp(".contact-submit-btn");
    }, 120); // Reduced from 200ms to 120ms

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      cleanupAnimations();
    };
  }, []);

  return (
    <>
      <SEO
        title="문의하기"
        description="비디오크루에 문의하세요. 영상 제작 문의, 견적 상담, 프로젝트 협의 등 다양한 문의사항을 편리하게 접수할 수 있습니다. 전문적인 영상 제작 서비스로 고객의 비즈니스를 성장시켜드립니다."
        keywords="비디오크루문의, 영상제작문의, 견적상담, 프로젝트협의, 영상제작업체문의, 비디오제작상담"
      />
      <div ref={containerRef} className="contact-page-container relative overflow-hidden">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("Contact page error:", error, errorInfo);
          }}
        >
          <section className="bg-black text-white w-full px-4 xs:px-6 md:px-8 lg:px-6 pt-16 pb-12 xs:pt-24 xs:pb-16 md:pt-28 md:pb-20 relative z-10">
            <div className="contact-content-rail max-w-[1248px] mx-auto flex flex-col justify-center items-center space-y-8">
              {/* Left Title Block — responsive width adjustments */}
              <div className="w-full md:w-[450px] lg:w-[700px] xl:w-[850px] text-center contact-title-left">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold leading-snug">
                  문의하기
                </h2>
              </div>

              {/* Right Paragraph Block — responsive text sizing */}
              <div className="w-full max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] text-lg xs:text-lg sm:text-xl md:text-lg lg:text-xl text-muted leading-relaxed text-center contact-title-right">
                {contactDescription.map((line, index) => (
                  <div key={index} className="contact-text-line">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <ErrorBoundary
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold mb-2">
                    문의 폼을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <ContactForm />
          </ErrorBoundary>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Contact;
