import React, { useEffect, useState, useRef } from "react";

interface FeatureCardData {
  image: string;
  title: string;
  desc: string;
  stepNum: string;
  subtitle?: string;
}

interface FeatureCardProps {
  data: FeatureCardData;
  alignRight?: boolean;
  isMobile?: boolean;
}

function ImgWithFallback({
  image,
  children,
  ...props
}: {
  image: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [imgSrc] = React.useState(image);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      {...props}
      style={{
        boxShadow: "0px 8px 40px rgba(22,29,43,0.3)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "280px",
        height: "380px",
        ...props.style,
      }}
      className={`group relative overflow-hidden border-[1px] border-gray-700 flex flex-col justify-end hover:scale-[1.02] transition-transform duration-300 ${
        props.className || ""
      }`}
    >
      {/* Main image with zoom effect */}
      <img
        src={imgSrc}
        alt=""
        onError={handleImageError}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 ${
          imageError ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Fallback image */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-400">이미지 로드 실패</p>
          </div>
        </div>
      )}

      {/* Overlay with smooth transition */}
      <div className="absolute inset-0 bg-black/50 z-10 transition-all duration-300 group-hover:bg-black/30" />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}

function ProcessFeatureCard({
  data,
  alignRight = false,
  isMobile = false,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Reset expanded state when screen size changes
  useEffect(() => {
    setIsExpanded(false);
  }, [isMobile]);

  // Responsive truncation based on screen size - percentage based
  const truncatePercentage = isMobile ? 0.6 : 0.7; // 60% on mobile/tablet, 70% on desktop
  const truncateLength = Math.floor(data.desc.length * truncatePercentage);
  const shortDesc =
    data.desc.length > truncateLength
      ? data.desc.substring(0, truncateLength) + "..."
      : data.desc;
  const displayDesc = isExpanded ? data.desc : shortDesc;
  const shouldShowToggle = data.desc.length > truncateLength;

  // Debug logging
  console.log(
    `Card ${data.stepNum}: isMobile=${isMobile}, descLength=${
      data.desc.length
    }, truncateLength=${truncateLength} (${Math.round(
      truncatePercentage * 100
    )}%), shouldShowToggle=${shouldShowToggle}`
  );

  return (
    <div
      ref={cardRef}
      className={`group flex flex-col ${
        alignRight ? "items-end" : "items-start"
      } animate-card ${isVisible ? "animate-card-visible" : ""}`}
      style={{ willChange: "opacity, transform" }}
    >
      <div
        className={`mb-2 group-hover:opacity-50 transition-opacity duration-300 w-full ${
          alignRight ? "text-right" : "text-left"
        }`}
      >
        <span className="inline-block text-6xl md:text-8xl lg:text-9xl font-black text-white opacity-30 select-none transition-all duration-300 group-hover:opacity-60 group-hover:scale-105 font-suit">
          {data.stepNum}
        </span>
      </div>

      <ImgWithFallback
        image={data.image}
        className="w-full max-w-2xl min-w-[320px]"
      >
        <div
          className="p-6 w-full flex flex-col text-left mr-auto items-start"
          data-card={data.stepNum}
        >
          <div className="see-more-group">
            <h3 className="font-bold text-lg md:text-xl mb-2 transition-colors duration-300 hover:text-blue-400 font-suit">
              {data.title}
            </h3>
            {data.subtitle && (
              <div className="subtitle text-lg md:text-xl font-medium mb-2 transition-colors duration-300 hover:text-blue-400 font-montserrat">
                {data.subtitle}
              </div>
            )}
            <div className="flex flex-col">
              <p className="opacity-80 text-gray-300 text-sm md:text-base transition-all duration-500 ease-in-out hover:opacity-100 font-suit leading-relaxed">
                <span className="transition-all duration-500 ease-in-out inline">
                  {displayDesc}
                </span>
                {shouldShowToggle && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white text-sm ml-1 transition-all duration-300 hover:text-blue-400 hover:translate-x-1 font-montserrat font-medium cursor-pointer inline"
                    onMouseEnter={() => {
                      const title = document.querySelector(
                        `[data-card="${data.stepNum}"] h3`
                      );
                      const subtitle = document.querySelector(
                        `[data-card="${data.stepNum}"] .subtitle`
                      );
                      if (title) title.classList.add("text-blue-400");
                      if (subtitle)
                        subtitle.classList.add("text-blue-400");
                    }}
                    onMouseLeave={() => {
                      const title = document.querySelector(
                        `[data-card="${data.stepNum}"] h3`
                      );
                      const subtitle = document.querySelector(
                        `[data-card="${data.stepNum}"] .subtitle`
                      );
                      if (title) title.classList.remove("text-blue-400");
                      if (subtitle)
                        subtitle.classList.remove("text-blue-400");
                    }}
                  >
                    {isExpanded ? "See less ←" : "See more →"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </ImgWithFallback>
    </div>
  );
}

const processSteps: FeatureCardData[] = [
  {
    stepNum: "01",
    image: "/imgs/process/Frame 395.webp",
    title: "상담 및 목표 설정",
    subtitle: "(Consultation & Goal Setting)",
    desc: "비디오크루는 고객님의 입장에서 먼저 고민합니다. 영상제작의 궁극적인 목적에 따라 브랜드 인지도 향상, 제품 판매 증진, 정보 전달과 기대효과, 주요 타겟 시청자",
  },
  {
    stepNum: "02",
    image: "/imgs/process/Frame 396.webp",
    title: "영상 기획 및 전략 수립",
    subtitle: "(Video Planning & Strategy)",
    desc: "설정된 목표와 예비 분석을 영상화 전략에 반영. 주요 스토리라인, 편집적인 흐름, 촬영 컨셉을 구체화합니다.",
  },
  {
    stepNum: "03",
    image: "/imgs/process/Frame 397.webp",
    title: "프리 프로덕션 및 구성안 확정",
    subtitle: "(Pre-Production & Storyboard/Script Confirmation)",
    desc: "확정된 기획안을 바탕으로 영상의 실제 제작을 위한 모든 세부 사항을 준비하고 설계합니다. 촬영용 최종 스크립트 작성, 각 장면의 구도와 움직임을 시각화하는 스토리보드(콘티) 제작",
  },
  {
    stepNum: "04",
    image: "/imgs/process/Frame 396-1.webp",
    title: "제작 및 촬영",
    subtitle: "(Production & Filming)",
    desc: "모든 준비가 완료된 프리 프로덕션 단계를 거쳐, 전문 촬영팀이 실제 영상 촬영을 진행합니다. 프로젝트의 성격과 규모에 최적화된 촬영 장비(카메라, 조명, 음향 등)를 활용하여",
  },
  {
    stepNum: "05",
    image: "/imgs/process/Frame 423.webp",
    title: "편집 및 후반 작업",
    subtitle: "(Editing & Post-Production)",
    desc: "촬영된 원본 영상을 편집하여 영상의 전체적인 흐름과 리듬을 만듭니다. 컷 편집, 색 보정(Color Grading), 사운드 믹싱, 필요한 경우 2D/3D 모션 그래픽 및 CG 작업",
  },
  {
    stepNum: "06",
    image: "/imgs/process/Frame 396-2.webp",
    title: "최종 검토, 전달 및 활용 지원",
    subtitle: "(Final Review, Delivery & Utilization Support)",
    desc: "완성된 영상은 내부 QA(품질 관리) 및 고객님의 최종 검토를 거쳐 최상의 퀄리티로 약속된 파일 형식(예: MP4, MOV 등) 및 사양으로 전달됩니다. 여기서 끝이 아닙니다",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

const ProcessStep = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-black pt-24 process_section text-white font-sans min-h-screen px-4 py-0 w-full">
      {/* TIMELINE */}
      <div className="relative w-full max-w-6xl mx-auto pt-10 pb-16">
        <div
          className="relative"
          style={{
            height: isMobile
              ? `${processSteps.length * 380 + 1000}px` // Extra buffer for mobile/tablet
              : `${processSteps.length * 380 + 180}px`, // Normal buffer for desktop
          }}
        >
          {processSteps.map((step, idx) => {
            const isRight = idx % 2 === 1;
            const baseRowGap = 380; // Increased gap for larger cards
            let topOffset = idx * baseRowGap;
            if (isMobile) {
              topOffset += idx * 180; // Increased extra space between steps for mobile
            } else if (idx > 0) {
              topOffset += isRight ? -80 : 0; // Moved right cards (02, 04, 06) further up
            }

            const cardWidth = "47%";
            const cardPositionClass = isMobile
              ? "left-1/2 transform -translate-x-1/2"
              : isRight
              ? "right-0"
              : "left-0";

            return (
              <React.Fragment key={step.stepNum}>
                {/* CARD */}
                <div
                  className={`absolute w-full md:w-[80%] lg:w-[47%] ${cardPositionClass}`}
                  style={{
                    top: `${topOffset}px`,
                    zIndex: 10 + idx,
                  }}
                >
                  <ProcessFeatureCard
                    data={step}
                    alignRight={!isMobile && isRight} // changed this from false to isRight and included !isMobile
                    isMobile={isMobile}
                  />
                </div>

                {/* ARROW CONNECTOR */}
                {idx < processSteps.length - 1 && (
                  <>
                    {isMobile ? (
                      // Vertical arrow for mobile
                      <div
                        className="relative h-10 flex justify-center items-center animate-arrow"
                        style={{
                          top: `${topOffset + 380}px`,
                        }}
                      >
                        <div className="vertical-dotted-arrow" />
                      </div>
                    ) : (
                      // Desktop layout
                      <>
                        {!isRight && (
                          <div
                            className="absolute horizontal-dotted-arrow animate-arrow"
                            style={{
                              top: `${topOffset + 460}px`,
                              left: `calc(${cardWidth} + 0px)`,
                              width: "80px",
                              height: "0px",
                              borderTop: "2px dotted #ccc",
                              zIndex: 5,
                            }}
                          />
                        )}
                        {isRight && (
                          <>
                            <div
                              className="absolute horizontal-dotted-arrow-reverse animate-arrow"
                              style={{
                                top: `${topOffset + 400}px`,
                                left: `calc(100% - ${cardWidth} - 160px)`,
                                width: "160px",
                                height: "0px",
                                borderTop: "2px dotted #ccc",
                                zIndex: 5,
                              }}
                            />
                            <div
                              className="absolute vertical-dotted-arrow animate-arrow"
                              style={{
                                top: `${topOffset + 400}px`,
                                left: `calc(100% - ${cardWidth} - 160px)`,
                                width: "0px",
                                height: "300px",
                                borderLeft: "2px dotted #ccc",
                                zIndex: 5,
                              }}
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;
