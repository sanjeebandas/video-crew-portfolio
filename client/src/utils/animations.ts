import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Extend Window interface to include gsap
declare global {
  interface Window {
    gsap: any;
  }
}

// Make gsap available globally for lazy loading compatibility
window.gsap = gsap;

// Utility function to refresh GSAP animations after lazy loading
export const refreshGSAPAnimations = (selector?: string) => {
  if (window.gsap) {
    // Clear any existing properties that might interfere
    if (selector) {
      window.gsap.set(selector, { clearProps: "all" });
    }
    
    // Force ScrollTrigger to refresh
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
    
    // Trigger a scroll event to re-evaluate animations
    setTimeout(() => {
      const event = new Event('scroll');
      window.dispatchEvent(event);
    }, 50);
  }
};

// Animation configurations with responsive considerations
export const ANIMATION_CONFIG = {
  duration: 0.8,
  ease: "power2.out",
  stagger: 0.1,
  scrollTrigger: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  },
};

// Responsive animation presets
export const ANIMATIONS = {
  slideInLeft: {
    x: -100,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration,
    ease: ANIMATION_CONFIG.ease,
  },
  slideInRight: {
    x: 100,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration,
    ease: ANIMATION_CONFIG.ease,
  },
  fadeInUp: {
    y: 50,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration,
    ease: ANIMATION_CONFIG.ease,
  },
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration,
    ease: ANIMATION_CONFIG.ease,
  },
  stackIn: {
    y: 100,
    opacity: 0,
    scale: 0.9,
    duration: ANIMATION_CONFIG.duration,
    ease: "back.out(1.7)",
  },
};

// Get responsive animation values based on screen size
const getResponsiveAnimationValues = () => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;

  return {
    slideDistance: isMobile ? 50 : isTablet ? 75 : 100,
    fadeDistance: isMobile ? 30 : isTablet ? 40 : 50,
    staggerDelay: isMobile ? 0.05 : isTablet ? 0.08 : 0.1,
    duration: isMobile ? 0.6 : isTablet ? 0.7 : 0.8,
  };
};

// Custom hooks for scroll animations
export const useScrollAnimations = () => {
  const slideInFromLeft = (
    elements: string | Element | Element[],
    options: any = {}
  ) => {
    const responsiveValues = getResponsiveAnimationValues();
    
    return gsap.fromTo(
      elements,
      { 
        x: -responsiveValues.slideDistance, 
        opacity: 0 
      },
      {
        x: 0,
        opacity: 1,
        duration: responsiveValues.duration,
        ease: ANIMATION_CONFIG.ease,
        ...options,
        scrollTrigger: {
          trigger: elements,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          ...options.scrollTrigger,
        },
      }
    );
  };

  const slideInFromRight = (
    elements: string | Element | Element[],
    options: any = {}
  ) => {
    const responsiveValues = getResponsiveAnimationValues();
    
    return gsap.fromTo(
      elements,
      { 
        x: responsiveValues.slideDistance, 
        opacity: 0 
      },
      {
        x: 0,
        opacity: 1,
        duration: responsiveValues.duration,
        ease: ANIMATION_CONFIG.ease,
        ...options,
        scrollTrigger: {
          trigger: elements,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          ...options.scrollTrigger,
        },
      }
    );
  };

  const fadeInUp = (
    elements: string | Element | Element[],
    options: any = {}
  ) => {
    const responsiveValues = getResponsiveAnimationValues();
    
    return gsap.fromTo(
      elements,
      { 
        y: responsiveValues.fadeDistance, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: responsiveValues.duration,
        ease: ANIMATION_CONFIG.ease,
        ...options,
        scrollTrigger: {
          trigger: elements,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          ...options.scrollTrigger,
        },
      }
    );
  };

  const stackIn = (
    elements: string | Element | Element[],
    stagger: number = 0.15,
    options: any = {}
  ) => {
    const responsiveValues = getResponsiveAnimationValues();
    
    return gsap.fromTo(
      elements,
      { ...ANIMATIONS.stackIn },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: responsiveValues.staggerDelay,
        duration: responsiveValues.duration,
        ease: "back.out(1.7)",
        ...options,
        scrollTrigger: {
          trigger: elements,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          ...options.scrollTrigger,
        },
      }
    );
  };

  const staggerFadeIn = (
    elements: string | Element | Element[],
    stagger: number = 0.1,
    options: any = {}
  ) => {
    const responsiveValues = getResponsiveAnimationValues();
    
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: responsiveValues.staggerDelay,
        duration: responsiveValues.duration,
        ease: ANIMATION_CONFIG.ease,
        ...options,
        scrollTrigger: {
          trigger: elements,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          ...options.scrollTrigger,
        },
      }
    );
  };

  const parallaxEffect = (
    element: string | Element,
    speed: number = 0.5,
    options: any = {}
  ) => {
    // Adjust parallax speed for mobile devices
    const isMobile = window.innerWidth < 768;
    const adjustedSpeed = isMobile ? speed * 0.5 : speed;
    
    return gsap.to(element, {
      yPercent: -50 * adjustedSpeed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        ...options,
      },
    });
  };

  return {
    slideInFromLeft,
    slideInFromRight,
    fadeInUp,
    stackIn,
    staggerFadeIn,
    parallaxEffect,
  };
};

// Cleanup function for component unmount
export const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Initialize GSAP with performance optimizations
export const initGSAP = () => {
  // Set GSAP defaults for better performance
  gsap.defaults({
    ease: "power2.out",
    duration: 0.8,
  });

  // Optimize ScrollTrigger for responsive devices
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  // Add responsive handling for window resize
  let resizeTimer: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
};
