import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  categories: { label: string; value: string }[];
};

const PortfolioBanner = ({
  currentFilter,
  setCurrentFilter,
  categories,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Initial animations on mount
  useEffect(() => {
    if (containerRef.current) {
      // Optimized banner entrance animation with shorter delays
      const tl = gsap.timeline();

      tl.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" } // Reduced from 0.8s to 0.5s
      )
        .fromTo(
          ".portfolio-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 0.6, y: 0, duration: 0.4, ease: "power2.out" }, // Reduced from 0.6s to 0.4s
          "-=0.3" // Reduced overlap for faster flow
        )
        .fromTo(
          ".portfolio-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, // Reduced from 0.8s to 0.5s
          "-=0.2" // Reduced overlap for faster flow
        )
        .fromTo(
          ".portfolio-button",
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4, // Reduced from 0.6s to 0.4s
            stagger: 0.06, // Reduced from 0.1s to 0.06s
            ease: "back.out(1.7)",
          },
          "-=0.1" // Reduced overlap for faster flow
        );
    }

    // Cleanup function to reset all button states
    return () => {
      const allButtons = document.querySelectorAll(".portfolio-button");
      allButtons.forEach((btn) => {
        gsap.set(btn, { scale: 1 });

        const activeOverlay = btn.querySelector(
          ".active-hover-overlay"
        ) as HTMLElement;
        const text = btn.querySelector(".button-text") as HTMLElement;

        if (activeOverlay) gsap.set(activeOverlay, { opacity: 0 });
        if (text) gsap.set(text, { textShadow: "none" });
      });
    };
  }, []);

  // Button hover animations
  const handleButtonHover = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const isActive = button.classList.contains("active");

    // If button is active, don't apply any hover effects
    if (isActive) {
      return;
    }

    // First, reset all other buttons to prevent hover state conflicts
    const allButtons = document.querySelectorAll(".portfolio-button");
    allButtons.forEach((btn) => {
      if (btn !== button) {
        // Reset scale for other buttons
        gsap.to(btn, {
          scale: 1,
          duration: 0.12, // Reduced from 0.15s to 0.12s
          ease: "power2.out",
        });

        // Reset overlays for other buttons
        const otherActiveOverlay = btn.querySelector(
          ".active-hover-overlay"
        ) as HTMLElement;
        const otherText = btn.querySelector(".button-text") as HTMLElement;

        if (otherActiveOverlay) {
          gsap.to(otherActiveOverlay, {
            opacity: 0,
            duration: 0.12, // Reduced from 0.15s to 0.12s
            ease: "power2.out",
          });
        }

        if (otherText) {
          gsap.to(otherText, {
            textShadow: "none",
            duration: 0.12, // Reduced from 0.15s to 0.12s
            ease: "power2.out",
          });
        }
      }
    });

    gsap.to(button, {
      scale: 1.04,
      duration: 0.2, // Reduced from 0.25s to 0.2s
      ease: "power2.out",
    });

    // Enhanced text glow effect
    const text = button.querySelector(".button-text") as HTMLElement;
    if (text) {
      gsap.to(text, {
        textShadow: "0 0 12px rgba(255,255,255,0.5)",
        duration: 0.15, // Reduced from 0.2s to 0.15s
        ease: "power2.out",
      });
    }
  };

  const handleButtonLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const isActive = button.classList.contains("active");

    // If button is active, don't apply any leave effects
    if (isActive) {
      return;
    }

    // Reset scale animation with faster, smoother timing
    gsap.to(button, {
      scale: 1,
      duration: 0.2, // Reduced from 0.25s to 0.2s
      ease: "power2.out",
    });

    const text = button.querySelector(".button-text") as HTMLElement;
    if (text) {
      gsap.to(text, {
        textShadow: "none",
        duration: 0.15, // Reduced from 0.2s to 0.15s
        ease: "power2.out",
      });
    }
  };

  const handleButtonClick = (value: string) => {
    setCurrentFilter(value);

    // Enhanced active button click animation
    const buttons = document.querySelectorAll(".portfolio-button");
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-value") === value;
      if (isActive) {
        // Reduced pop-up click effect to prevent overlap
        gsap.to(btn, {
          scale: 1.08,
          duration: 0.1, // Reduced from 0.12s to 0.1s
          ease: "back.out(1.7)",
          yoyo: true,
          repeat: 1,
        });

        // Add pressed state visual feedback
        const text = btn.querySelector(".button-text") as HTMLElement;
        if (text) {
          gsap.to(text, {
            textShadow: "0 0 20px rgba(0,0,0,0.8)",
            duration: 0.1, // Reduced from 0.12s to 0.1s
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          });
        }
      }
    });
  };

  return (
    <section className="text-center pt-24 pb-16 px-4 md:px-8 lg:px-0">
      <div ref={containerRef} className="portfolio-content-rail max-w-[1248px] mx-auto">
        <p className="portfolio-subtitle text-sm tracking-[0.25em] text-white mb-2">
          PORTFOLIO
        </p>
        <h1 className="portfolio-title text-3xl md:text-5xl font-semibold text-white leading-tight mb-8">
          We Create Beautiful,
          <br />
          <span className="text-[#4D74FF]">Practical Works</span>
        </h1>

        <div
          ref={buttonsRef}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          {categories.map(({ label, value }) => (
            <button
              key={value}
              data-value={value}
              onClick={() => handleButtonClick(value)}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              className={`portfolio-button relative w-[268px] h-[27px] md:w-[274px] md:h-[70px] 
              text-xs md:text-xl rounded-full border overflow-hidden
              ${
                currentFilter === value
                  ? "active bg-white text-black border-white"
                  : "text-white border-white"
              }`}
            >
              {/* Active state indicator - pressed look */}
              {currentFilter === value && (
                <div
                  className="active-overlay absolute inset-0 bg-white shadow-lg"
                  style={{
                    transformOrigin: "center",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.8)",
                  }}
                />
              )}

              {/* Text content */}
              <span className="button-text relative z-10 font-medium transition-all duration-300">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioBanner;
