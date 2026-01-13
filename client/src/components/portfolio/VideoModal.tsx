import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { PortfolioItem } from "../../types/portfolio";

type Props = {
  item: PortfolioItem;
  isOpen: boolean;
  onClose: () => void;
};

const VideoModal = ({ item, isOpen, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle escape key and backdrop click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Auto-play video when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop with blur - covers entire viewport */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-lg transition-all duration-300 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content - Enlarged size, centered */}
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4">
        {/* Video Container */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
          />
          
          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
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
      </div>
    </div>
  );

  // Use portal to render at document root level, breaking out of any parent containers
  return createPortal(modalContent, document.body);
};

export default VideoModal;
