import { useEffect, useRef } from "react";
import { useScrollAnimations, cleanupAnimations } from "../utils/animations";
import ContactBanner from "../components/contact/ContactBanner";
import ContactForm from "../components/contact/ContactForm";
import SEO from "../components/common/SEO";
import ErrorBoundary from "../components/common/ErrorBoundary";

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slideInFromLeft, fadeInUp, staggerFadeIn, stackIn } = useScrollAnimations();

  useEffect(() => {
    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // Contact page scroll animations
      slideInFromLeft(".contact-title");
      staggerFadeIn(".contact-text-line", 0.06); // Reduced stagger delay
      fadeInUp(".contact-info-section");
      staggerFadeIn(".contact-info-item", 0.1); // Reduced stagger delay
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
      <div ref={containerRef} className="relative overflow-hidden">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Contact page error:', error, errorInfo);
          }}
        >
          <ContactBanner />
          <ErrorBoundary
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold mb-2">문의 폼을 불러올 수 없습니다</h3>
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
