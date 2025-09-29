# Scroll Animations Implementation Guide

## 🎯 Overview

This document outlines the scroll-triggered animations implemented across the Homepage and its components using GSAP ScrollTrigger.

## 📁 Files Modified

### Core Animation System
- `src/utils/animations.ts` - Animation utilities and hooks
- `src/App.tsx` - GSAP initialization

### Homepage Components
- `src/pages/Home.tsx` - Main homepage with scroll animations
- `src/components/home/HeroSection.tsx` - Hero carousel animations
- `src/components/home/ServicesGrid.tsx` - Service cards stack animations
- `src/components/home/PortfolioScroller.tsx` - Portfolio image animations
- `src/components/home/BackgroundBanner.tsx` - Stats banner animations

## 🎨 Animation Types Implemented

### 1. **Slide Animations**
- **Left to Right**: `.home-title-left`, `.portfolio-title`
- **Right to Left**: `.home-title-right`
- **Effect**: Elements slide in from off-screen with opacity fade

### 2. **Stack Animations**
- **Service Cards**: `.service-card` - Cards appear in a stacking motion
- **Effect**: Scale + Y-axis movement with staggered timing

### 3. **Fade Animations**
- **Text Lines**: `.home-text-line` - Staggered text reveal
- **Subtitles**: `.home-subtitle` - Smooth fade in from bottom
- **Portfolio Images**: `.portfolio-image` - Quick staggered fade

### 4. **Parallax Effects**
- **Background Images**: `.home-parallax-bg` - Subtle parallax scrolling
- **Effect**: Background elements move at different speeds

### 5. **Hero Animations**
- **Initial Load**: Timeline-based entrance animations
- **Carousel Changes**: Smooth text transitions
- **Dot Indicators**: Staggered dot animations

## 🎯 Animation Classes

### Home Page
```css
.home-title-left      /* Slide in from left */
.home-title-right     /* Slide in from right */
.home-subtitle        /* Fade in from bottom */
.home-text-line       /* Staggered text reveal */
.home-section-card    /* Stack animation for sections */
.home-parallax-bg     /* Parallax background effect */
```

### Hero Section
```css
.hero-subtitle        /* Hero text animations */
.hero-title          /* Hero title animations */
.hero-dots           /* Dot container animations */
.carousel-dot        /* Individual dot animations */
```

### Services Grid
```css
.service-card         /* Stack animation for cards */
.service-title        /* Staggered title animations */
.service-description  /* Staggered description animations */
```

### Portfolio Scroller
```css
.portfolio-title      /* Slide in from left */
.portfolio-subtitle   /* Staggered subtitle animation */
.portfolio-image      /* Staggered image animations */
```

### Background Banner
```css
.stat-item           /* Staggered stat animations */
.stat-left           /* Slide in from left */
.stat-right          /* Slide in from right */
```

## ⚙️ Animation Configuration

### Trigger Settings
```typescript
scrollTrigger: {
  trigger: elements,           // Element that triggers animation
  start: "top 85%",           // When to start (85% from top)
  end: "bottom 15%",          // When to end (15% from bottom)
  toggleActions: "play none none reverse", // Play forward, reverse on scroll up
}
```

### Timing Settings
```typescript
duration: 0.8,        // Animation duration
ease: "power2.out",   // Easing function
stagger: 0.1,         // Delay between staggered elements
```

## 🚀 Performance Optimizations

### 1. **ScrollTrigger Optimization**
- `ignoreMobileResize: true` - Prevents unnecessary refreshes
- `autoRefreshEvents` - Optimized refresh events
- Proper cleanup on component unmount

### 2. **Animation Efficiency**
- Hardware acceleration enabled
- Minimal DOM queries
- Efficient easing functions

### 3. **Mobile Considerations**
- Reduced motion support
- Touch-friendly interactions
- Optimized for mobile performance

## 🔧 Customization

### Adding New Animations
```typescript
// In useScrollAnimations hook
const customAnimation = (elements, options = {}) => {
  return gsap.fromTo(
    elements,
    { x: -100, opacity: 0 }, // Initial state
    {
      x: 0,
      opacity: 1,
      ...options,
      scrollTrigger: {
        trigger: elements,
        start: "top 80%",
        toggleActions: "play none none reverse",
        ...options.scrollTrigger,
      },
    }
  );
};
```

### Modifying Existing Animations
```typescript
// Change animation timing
slideInFromLeft(".my-element", {
  duration: 1.2,
  ease: "back.out(1.7)",
  scrollTrigger: {
    start: "top 70%", // Earlier trigger
  }
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Animations not triggering**
   - Check if elements have correct CSS classes
   - Verify ScrollTrigger is registered
   - Check browser console for errors

2. **Performance issues**
   - Reduce number of simultaneous animations
   - Use `will-change` CSS property
   - Optimize ScrollTrigger settings

3. **Mobile issues**
   - Test on actual devices
   - Check touch interactions
   - Verify mobile performance

### Debug Mode
```typescript
// Enable ScrollTrigger markers for debugging
ScrollTrigger.create({
  trigger: ".my-element",
  start: "top 80%",
  end: "bottom 20%",
  markers: true, // Shows trigger markers
});
```

## 📱 Mobile Considerations

### Touch Interactions
- Animations respect `prefers-reduced-motion`
- Touch-friendly trigger zones
- Optimized for mobile performance

### Performance
- Reduced animation complexity on mobile
- Efficient ScrollTrigger settings
- Hardware acceleration enabled

## 🎯 Best Practices

1. **Always cleanup animations** on component unmount
2. **Use stagger animations** for multiple elements
3. **Keep animations subtle** and professional
4. **Test on different devices** and browsers
5. **Optimize for performance** and accessibility
6. **Use meaningful class names** for easy maintenance

---

**Animation System Ready!** 🚀

The scroll animations are now implemented across all homepage components with smooth, performant effects that enhance the user experience.
