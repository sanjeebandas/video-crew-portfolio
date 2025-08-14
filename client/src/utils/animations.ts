import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation configurations
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

// Common animation presets
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

// Custom hooks for scroll animations
export const useScrollAnimations = () => {
  const slideInFromLeft = (
    elements: string | Element | Element[],
    options: any = {}
  ) => {
    return gsap.fromTo(
      elements,
      { ...ANIMATIONS.slideInLeft },
      {
        x: 0,
        opacity: 1,
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
    return gsap.fromTo(
      elements,
      { ...ANIMATIONS.slideInRight },
      {
        x: 0,
        opacity: 1,
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
    return gsap.fromTo(
      elements,
      { ...ANIMATIONS.fadeInUp },
      {
        y: 0,
        opacity: 1,
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
    return gsap.fromTo(
      elements,
      { ...ANIMATIONS.stackIn },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger,
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
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger,
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
    return gsap.to(element, {
      yPercent: -50 * speed,
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

  // Optimize ScrollTrigger
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
};
