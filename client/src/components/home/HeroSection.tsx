import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// Skeleton Loader Component for Hero Banner
const HeroBannerSkeleton = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
    {/* Animated shimmer overlay */}
    <div className="absolute inset-0 animate-pulse">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        style={{
          animation: "shimmer 2s infinite linear",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
    
    {/* Subtle geometric pattern for visual interest */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/8 blur-2xl" />
    </div>

    {/* Center loading indicator */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Play icon skeleton */}
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-white/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* Rotating ring around play button */}
          <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" style={{ animationDuration: "1.5s" }} />
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <p className="text-white/40 text-sm md:text-base font-medium">영상 불러오는 중...</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>

    {/* Shimmer keyframe styles */}
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video source - uses environment variable for production (Render storage)
  // Falls back to local path for development
  const videoSrc = import.meta.env.VITE_HERO_VIDEO_URL || "/vids/HomePage_Hero_Banner.mp4";

  // Detect mobile for responsive behavior (rail-centering handled by CSS)
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Hero section animations
  useEffect(() => {
    if (heroRef.current) {
      const heroTimeline = gsap.timeline();

      heroTimeline
        .fromTo(
          heroRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out" }
        )
        .fromTo(
          ".hero-controls",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
          "-=0.4"
        );
    }
  }, []);

  // Auto-play video when it's ready
  useEffect(() => {
    const video = videoRef.current;
    if (video && isVideoLoaded && !hasVideoError) {
      video.play().catch((err) => {
        console.warn("Video autoplay failed:", err);
        // Autoplay might be blocked, video will show poster
      });
    }
  }, [isVideoLoaded, hasVideoError]);

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.warn);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleCanPlay = () => {
    setIsVideoLoaded(true);
  };

  const handlePlaying = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoError = () => {
    setHasVideoError(true);
    setIsVideoLoaded(true); // Stop showing loader
  };

  const handleWaiting = () => {
    setIsVideoPlaying(false);
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-black text-white overflow-hidden hero-rail-centered"
      style={{
        // Mobile gets constrained height
        ...(isMobile && {
          height: "100vh",
          minHeight: "500px",
          maxHeight: "85vh",
        }),
        // Desktop uses full viewport height
        ...(!isMobile && {
          height: "100vh",
          minHeight: "600px",
        }),
      }}
    >
      {/* Video Banner Container - Locked-width with proportional scaling */}
      <div className="hero-video-container hero-video-locked-width z-0">
        {/* Skeleton Loading State - Shows while video is loading */}
        {!isVideoLoaded && !hasVideoError && (
          <HeroBannerSkeleton />
        )}

        {/* Error state overlay */}
        {hasVideoError && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center text-white bg-black/40 backdrop-blur-sm px-8 py-6 rounded-2xl border border-white/10">
                <div className="w-14 h-14 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-base text-white/80 font-medium">영상을 불러올 수 없습니다</p>
                <p className="text-sm text-white/50 mt-1">잠시 후 다시 시도해주세요</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Element - locked-width with proportional scaling, no cropping */}
        <video
          ref={videoRef}
          src={videoSrc}
          className={`hero-video-element transition-opacity duration-700 ${
            isVideoPlaying && !hasVideoError ? "opacity-100" : "opacity-0"
          }`}
          style={{
            // Locked-width approach: video scales proportionally, maintains aspect ratio, no cropping
            objectFit: "contain",
            objectPosition: "center center",
          }}
          autoPlay
          muted
          playsInline
          preload={isMobile ? "metadata" : "auto"}
          onCanPlay={handleCanPlay}
          onPlaying={handlePlaying}
          onWaiting={handleWaiting}
          onError={handleVideoError}
          onEnded={() => {
            // Loop the video
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(console.warn);
            }
          }}
        />

        {/* Subtle dark overlay for better UI contrast - only visible when video is playing */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none transition-opacity duration-700 ${
            isVideoPlaying ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Video Controls - Inside video container so they align with video on large screens */}
        <div className="hero-controls absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <div className="flex items-center gap-2 3xl:gap-3">
          {/* Replay Button - Scaled on ultra-wide */}
          <button
            onClick={handleReplay}
            className="group flex items-center justify-center w-9 h-9 md:w-10 md:h-10 3xl:w-11 3xl:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:border-white/30 transition-all duration-300 active:scale-95"
            aria-label="Replay video"
            title="다시 재생"
          >
            <svg
              className="w-3.5 h-3.5 md:w-4 md:h-4 3xl:w-5 3xl:h-5 text-white/70 group-hover:text-white transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Volume Toggle Button - Scaled on ultra-wide */}
          <button
            onClick={handleToggleMute}
            className="group flex items-center justify-center w-9 h-9 md:w-10 md:h-10 3xl:w-11 3xl:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:border-white/30 transition-all duration-300 active:scale-95"
            aria-label={isMuted ? "소리 켜기" : "소리 끄기"}
            title={isMuted ? "소리 켜기" : "소리 끄기"}
          >
            {isMuted ? (
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4 3xl:w-5 3xl:h-5 text-white/70 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4 3xl:w-5 3xl:h-5 text-white/70 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
