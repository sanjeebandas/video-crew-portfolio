import { useEffect, useRef } from "react";
import { useScrollAnimations, cleanupAnimations } from "../utils/animations";
import ContactBanner from "../components/contact/ContactBanner";
import ContactForm from "../components/contact/ContactForm";
import SEO from "../components/common/SEO";

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slideInFromLeft, fadeInUp, staggerFadeIn, stackIn, parallaxEffect } = useScrollAnimations();

  useEffect(() => {
    // Add a small delay to ensure lazy loading doesn't interfere with initial animations
    const timer = setTimeout(() => {
      // Contact page scroll animations
      slideInFromLeft(".contact-title");
      staggerFadeIn(".contact-text-line", 0.1);
      fadeInUp(".contact-info-section");
      staggerFadeIn(".contact-info-item", 0.2);
      parallaxEffect(".contact-image", 0.3);
      stackIn(".contact-form-row", 0.1);
      fadeInUp(".contact-submit-btn");
    }, 200);

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
        <ContactBanner />
        <ContactForm />
      </div>
    </>
  );
};

export default Contact;
