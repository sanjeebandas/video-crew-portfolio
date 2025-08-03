import React, { useState } from "react";
import type { PortfolioItem } from "../../types/portfolio";

type Props = {
  item: PortfolioItem;
};

const PortfolioCard = ({ item }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-full max-w-[1120px] aspect-[2/1] rounded-2xl overflow-hidden bg-black shadow-none transition duration-300 group hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]">
        {isPlaying ? (
          <video
            src={item.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full cursor-pointer relative"
            onClick={() => setIsPlaying(true)}
          >
            <img
              src={item.thumbnailUrl}
              alt={item.title}
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
                  <p className="text-sm md:text-base font-semibold">{item.title}</p>
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
