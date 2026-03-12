import { useState } from "react";
import { getMediaUrl } from "../../utils/helpers";

type PortfolioItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  client?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  createdAt: string;
};

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
  onViewDetails: (item: PortfolioItem) => void;
  onPreviewVideo: (videoUrl: string) => void;
  isDeleting: boolean;
  isOffline: boolean;
}

const PortfolioItemCard = ({
  item,
  onEdit,
  onDelete,
  onViewDetails,
  onPreviewVideo,
  isDeleting,
  isOffline,
}: PortfolioItemCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1F1F1F';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-800">
        {item.thumbnailUrl && !imageError ? (
          <img
            src={getMediaUrl(item.thumbnailUrl)}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <span className="text-4xl text-gray-500">🎬</span>
          </div>
        )}

        {/* Video Preview Button */}
        {item.videoUrl && (
          <button
            onClick={() => onPreviewVideo(getMediaUrl(item.videoUrl!))}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-200"
            title="Preview Video"
            aria-label={`Preview video for ${item.title}`}
          >
            ▶️
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-300 text-sm mb-2 line-clamp-3">
            {item.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="bg-gray-800 px-2 py-1 rounded-full">
              {item.category}
            </span>
            {item.client && (
              <span className="bg-blue-600/50 px-2 py-1 rounded-full">
                {item.client}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(item)}
              className="px-3 py-1 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 border border-gray-600 hover:border-gray-500"
              aria-label={`View details for ${item.title}`}
            >
              Details
            </button>

            <button
              onClick={() => onEdit(item)}
              className="px-3 py-1 text-xs rounded-lg bg-blue-600/50 hover:bg-blue-500/50 text-white transition-all duration-200 border border-blue-600/50 hover:border-blue-500/50"
              aria-label={`Edit ${item.title}`}
              disabled={isOffline}
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(item._id)}
              className={`px-3 py-1 text-xs rounded-lg bg-red-600/50 hover:bg-red-500/50 text-white transition-all duration-200 border border-red-600/50 hover:border-red-500/50 ${
                isDeleting ? "opacity-50 pointer-events-none" : ""
              }`}
              aria-label={`Delete ${item.title}`}
              disabled={isOffline || isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin">⏳</span>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemCard;
