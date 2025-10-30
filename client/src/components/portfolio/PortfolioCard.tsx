import { useState } from "react";
import type { PortfolioItem } from "../../types/portfolio";
import LazyImage from "../common/LazyImage";
import VideoModal from "./VideoModal";

type Props = {
  item: PortfolioItem;
};

const PortfolioCard = ({ item }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center py-8">
        <div className="relative w-full max-w-[1120px] aspect-[2/1] rounded-2xl overflow-hidden bg-black shadow-none transition duration-300 group hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]">
          <div
            className="w-full h-full cursor-pointer relative"
            onClick={() => {
              console.log('Portfolio card clicked, opening modal for:', item.title);
              console.log('Video URL:', item.videoUrl);
              setIsModalOpen(true);
            }}
          >
            {/* Loading State */}
            {isImageLoading && !hasImageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-4">
                  {/* Spinning loader with pulse effect */}
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-white/40 rounded-full animate-ping"></div>
                  </div>
                  {/* Loading text with fade animation */}
                  <p className="text-white/80 text-sm font-medium animate-pulse">썸네일 로딩 중...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {hasImageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  {/* Error icon */}
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {/* Error text */}
                  <p className="text-white/70 text-sm font-medium">이미지를 불러올 수 없습니다</p>
                </div>
              </div>
            )}

            <LazyImage
              src={item.thumbnailUrl}
              alt={`${item.title} - 비디오크루 포트폴리오 썸네일`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => {
                setIsImageLoading(false);
                setHasImageError(false);
              }}
              onError={() => {
                setIsImageLoading(false);
                setHasImageError(true);
              }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 transition duration-300" />

            {/* CTA block */}
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3">
              <div className="flex items-center gap-1 md:gap-2 bg-black/80 backdrop-blur-md px-2 py-1 md:px-2.5 md:py-1.5 rounded-full text-white transition duration-300 hover:shadow-[0_0_20px_6px_rgba(255,255,255,0.2)] hover:scale-[1.03] cursor-pointer">
                {/* Play Icon Circle */}
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Title + Subtitle */}
                <div className="text-left">
                  <p className="text-[10px] md:text-xs font-semibold">
                    {item.title}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-gray-400">Play Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PortfolioCard;
