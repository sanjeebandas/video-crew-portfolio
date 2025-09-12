import { useState } from "react";
import type { PortfolioItem } from "../../types/portfolio";
import LazyImage from "../common/LazyImage";
import VideoModal from "./VideoModal";

type Props = {
  item: PortfolioItem;
};

const PortfolioCard = ({ item }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center py-8">
        <div className="relative w-full max-w-[1120px] aspect-[2/1] rounded-2xl overflow-hidden bg-black shadow-none transition duration-300 group hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]">
          <div
            className="w-full h-full cursor-pointer relative"
            onClick={() => setIsModalOpen(true)}
          >
            <LazyImage
              src={item.thumbnailUrl}
              alt={`${item.title} - 비디오크루 포트폴리오 썸네일`}
              className="w-full h-full object-cover"
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
