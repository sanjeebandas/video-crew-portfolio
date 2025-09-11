import { useState, useRef } from "react";
import type { PortfolioItem } from "../../types/portfolio";
import LazyImage from "../common/LazyImage";

type Props = {
  item: PortfolioItem;
};

const PortfolioCard = ({ item }: Props) => {
  const [isVideoMode, setIsVideoMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-full max-w-[1120px] aspect-[2/1] rounded-2xl overflow-hidden bg-black shadow-none transition duration-300 group hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]">
        {isVideoMode ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={item.videoUrl}
              autoPlay
              className="w-full h-full object-cover"
              controls
            />

            {/* Close Button - Top Right */}
            <button
              onClick={() => setIsVideoMode(false)}
              className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm hover:bg-red-600/80 text-white px-3 py-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center gap-2 group"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
              <span className="text-sm font-medium">Close</span>
            </button>

          </div>
        ) : (
          <div
            className="w-full h-full cursor-pointer relative"
            onClick={() => setIsVideoMode(true)}
          >
            <LazyImage
              src={item.thumbnailUrl}
              alt={`${item.title} - 비디오크루 포트폴리오 썸네일`}
              className="w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 transition duration-300" />

            {/* CTA block */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
              <div className="flex items-center gap-2 md:gap-4 bg-black/80 backdrop-blur-md px-4 py-2 md:px-6 md:py-4 rounded-full text-white transition duration-300 hover:shadow-[0_0_20px_6px_rgba(255,255,255,0.2)] hover:scale-[1.03] cursor-pointer">
                {/* Play Icon Circle */}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 md:w-5 md:h-5 fill-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Title + Subtitle */}
                <div className="text-left">
                  <p className="text-sm md:text-base font-semibold">
                    {item.title}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400">Play Video</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;
