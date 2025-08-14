import { useEffect, useRef } from "react";
import { useScrollAnimations, cleanupAnimations } from "../utils/animations";
import ContactBanner from "../components/contact/ContactBanner";
import ContactForm from "../components/contact/ContactForm";

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slideInFromLeft, fadeInUp, staggerFadeIn, stackIn, parallaxEffect } = useScrollAnimations();

  useEffect(() => {
    // Contact page scroll animations
    slideInFromLeft(".contact-title");
    staggerFadeIn(".contact-text-line", 0.1);
    fadeInUp(".contact-info-section");
    staggerFadeIn(".contact-info-item", 0.2);
    parallaxEffect(".contact-image", 0.3);
    stackIn(".contact-form-row", 0.1);
    fadeInUp(".contact-submit-btn");

    // Cleanup on unmount
    return () => {
      cleanupAnimations();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <ContactBanner />
      <ContactForm />
    </div>
  );
};

export default Contact;
