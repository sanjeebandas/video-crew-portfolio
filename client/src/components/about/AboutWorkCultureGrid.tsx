const workCultureItems = [
  {
    title: "'Agile' Performance",
    subtitle: "결과중심의 유연한 과업 수행",
    description: "비디오크루는 결과 중심으로 유연하고 빠르게 대응합니다.",
    image: "imgs/about/Image/placeholder-2.webp",
  },
  {
    title: "Effectiveness",
    subtitle: "형식보다는 효과에 집중",
    description:
      "비디오크루는 형식에 치중하기보다는 \n실용성과 성과, 효과에 집중합니다.",
    image: "imgs/about/Image/placeholder-1.webp",
  },
  {
    title: "Knowledge Sharing",
    subtitle: "콘텐츠의 확산",
    description:
      "적시적소에 영상 서비스를 제공하는​ \n비디오 컨설턴트로의 역할을 수행합니다.",
    image: "imgs/about/Image/placeholder.webp",
  },
];

import { useEffect, useState } from "react";
import { useScrollAnimations } from "../../utils/animations";

const AboutWorkCultureGrid = () => {
  const { stackIn, staggerFadeIn } = useScrollAnimations();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (src: string) => {
    setImageErrors((prev) => new Set([...prev, src]));
  };

  useEffect(() => {
    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // Work culture grid animations - optimized for mobile scroll performance
      stackIn(".work-culture-card", 0.06); // Reduced from 0.1s to 0.06s for faster desktop

      // Mobile-optimized animations with faster stagger for smoother scroll experience
      staggerFadeIn(".work-culture-mobile-card", 0.06); // Reduced from 0.2s to 0.06s for snappier mobile
      staggerFadeIn(".work-culture-tablet-card", 0.06); // Reduced from 0.2s to 0.06s for smoother tablet
      staggerFadeIn(".work-culture-ipad-card", 0.06); // Reduced from 0.2s to 0.06s for consistent timing

      // Text animations with unified faster timing for better mobile performance
      staggerFadeIn(".work-culture-text", 0.06); // Reduced from 0.1s to 0.06s
      staggerFadeIn(".work-culture-mobile-text", 0.06); // Reduced from 0.2s to 0.06s for smoother mobile
      staggerFadeIn(".work-culture-tablet-text", 0.06); // Reduced from 0.2s to 0.06s
      staggerFadeIn(".work-culture-ipad-text", 0.06); // Reduced from 0.2s to 0.06s
    }, 120); // Added 120ms delay for lazy loading compatibility

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="w-full bg-black text-white px-6 py-16 -mt-10">
      <div className="max-w-[1248px] mx-auto">
        {/* Desktop Layout (hidden on iPad Pro) */}
        <div className="hidden xl:grid grid-cols-2 gap-6">
          {/* Top Row - Two Cards */}
          <div className="grid grid-cols-2 gap-6 col-span-2">
            {workCultureItems.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="work-culture-card relative w-[613px] h-[548px] overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl group"
              >
                {!imageErrors.has(item.image) ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={() => handleImageError(item.image)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
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
                      <p className="text-xs text-muted">이미지 로드 실패</p>
                    </div>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute bottom-4 left-0 w-full h-48 p-6 transition-all duration-300 ease-out">
                  <div className="flex flex-col gap-2 h-full">
                    <p className="work-culture-text text-md text-muted uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                      {item.subtitle}
                    </p>
                    <h3 className="work-culture-text text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300 ease-out">
                      {item.title}
                    </h3>
                    <p className="work-culture-text text-md text-muted leading-relaxed group-hover:text-gray-200 transition-colors duration-300 ease-out whitespace-pre-line flex-grow">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - One Large Card */}
          <div className="col-span-2">
            <div className="work-culture-ipad-card relative w-[1248px] h-[560px] overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl group">
              {!imageErrors.has(workCultureItems[2].image) ? (
                <img
                  src={workCultureItems[2].image}
                  alt={workCultureItems[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  onError={() => handleImageError(workCultureItems[2].image)}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
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
                    <p className="text-xs text-muted">이미지 로드 실패</p>
                  </div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute bottom-4 left-0 w-full h-48 p-6 transition-all duration-300 ease-out">
                <div className="flex flex-col gap-2 h-full">
                  <p className="work-culture-text text-md text-muted uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                    {workCultureItems[2].subtitle}
                  </p>
                  <h3 className="work-culture-text text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300 ease-out">
                    {workCultureItems[2].title}
                  </h3>
                  <p className="work-culture-text text-md text-muted leading-relaxed max-w-2xl group-hover:text-gray-200 transition-colors duration-300 ease-out whitespace-pre-line flex-grow">
                    {workCultureItems[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iPad Pro Layout (hidden on desktop and mobile) */}
        <div className="hidden lg:grid xl:hidden grid-cols-2 gap-6">
          {/* Top Row - Two Cards */}
          <div className="grid grid-cols-2 gap-6 col-span-2">
            {workCultureItems.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="work-culture-ipad-card relative w-full h-[480px] overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl group"
              >
                {!imageErrors.has(item.image) ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={() => handleImageError(item.image)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
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
                      <p className="text-xs text-muted">이미지 로드 실패</p>
                    </div>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute bottom-3 left-0 w-full h-40 p-6 transition-all duration-300 ease-out">
                  <div className="flex flex-col gap-2 h-full">
                    <p className="work-culture-ipad-text text-xs text-muted uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                      {item.subtitle}
                    </p>
                    <h3 className="work-culture-ipad-text text-lg font-bold mb-2 group-hover:text-white transition-colors duration-300 ease-out">
                      {item.title}
                    </h3>
                    <p className="work-culture-ipad-text text-sm text-muted leading-relaxed group-hover:text-gray-100 transition-colors duration-300 ease-out whitespace-pre-line flex-grow">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - One Large Card */}
          <div className="col-span-2">
            <div className="work-culture-card relative w-full h-[520px] overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl group">
              {!imageErrors.has(workCultureItems[2].image) ? (
                <img
                  src={workCultureItems[2].image}
                  alt={workCultureItems[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  onError={() => handleImageError(workCultureItems[2].image)}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
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
                    <p className="text-xs text-muted">이미지 로드 실패</p>
                  </div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute bottom-3 left-0 w-full h-40 p-6 transition-all duration-300 ease-out">
                <div className="flex flex-col gap-2 h-full">
                  <p className="work-culture-ipad-text text-xs text-muted uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                    {workCultureItems[2].subtitle}
                  </p>
                  <h3 className="work-culture-ipad-text text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300 ease-out">
                    {workCultureItems[2].title}
                  </h3>
                  <p className="work-culture-ipad-text text-base text-muted leading-relaxed max-w-2xl group-hover:text-gray-100 transition-colors duration-300 ease-out whitespace-pre-line flex-grow">
                    {workCultureItems[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout - Intermediate between mobile and desktop */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
          {/* Top Row - Two Cards */}
          <div className="grid grid-cols-2 gap-4 col-span-2">
            {workCultureItems.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="work-culture-tablet-card relative w-full h-[400px] overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl group"
              >
                {!imageErrors.has(item.image) ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={() => handleImageError(item.image)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
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
                      <p className="text-xs text-muted">이미지 로드 실패</p>
                    </div>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute bottom-2 left-0 w-full h-36 p-4 transition-all duration-300 ease-out">
                  <div className="flex flex-col gap-1 h-full">
                    <p className="work-culture-tablet-text text-xs text-muted uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                      {item.subtitle}
                    </p>
                    <h3 className="work-culture-tablet-text text-base font-bold mb-1 group-hover:text-white transition-colors duration-300 ease-out">
                      {item.title}
                    </h3>
                    <p className="work-culture-tablet-text text-xs text-muted leading-snug group-hover:text-gray-100 transition-colors duration-300 ease-out whitespace-pre-line flex-grow">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - One Large Card */}
          <div className="col-span-2">
            <div className="work-culture-tablet-card relative w-full h-[450px] overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl group">
              {!imageErrors.has(workCultureItems[2].image) ? (
                <img
                  src={workCultureItems[2].image}
                  alt={workCultureItems[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  onError={() => handleImageError(workCultureItems[2].image)}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
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
                    <p className="text-xs text-muted">이미지 로드 실패</p>
                  </div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute bottom-2 left-0 w-full h-36 p-4 transition-all duration-300 ease-out">
                <div className="flex flex-col gap-1 h-full">
                  <p className="work-culture-tablet-text text-xs text-muted uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                    {workCultureItems[2].subtitle}
                  </p>
                  <h3 className="work-culture-tablet-text text-lg font-bold mb-1 group-hover:text-white transition-colors duration-300 ease-out">
                    {workCultureItems[2].title}
                  </h3>
                  <p className="work-culture-tablet-text text-sm text-muted leading-snug group-hover:text-gray-100 transition-colors duration-300 ease-out whitespace-pre-line flex-grow">
                    {workCultureItems[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden grid grid-cols-1 gap-6 place-items-center">
          {workCultureItems.map((item, idx) => (
            <div
              key={idx}
              className="work-culture-mobile-card relative w-[302px] h-[257px] min-[768px]:w-[360px] min-[768px]:h-[300px] rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {/* Overlay */}
              <div className="absolute bottom-2 left-0 w-full h-32 p-4 transition-all duration-300 ease-out">
                <div className="flex flex-col gap-1 h-full">
                  <p className="work-culture-mobile-text text-xs text-muted uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300 ease-out">
                    {item.subtitle}
                  </p>
                  <h3 className="work-culture-mobile-text text-base font-bold mb-1 group-hover:text-white transition-colors duration-300 ease-out">
                    {item.title}
                  </h3>
                  <p className="work-culture-mobile-text text-xs text-muted leading-snug group-hover:text-gray-100 transition-colors duration-300 ease-out whitespace-pre-line flex-grow">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutWorkCultureGrid;
