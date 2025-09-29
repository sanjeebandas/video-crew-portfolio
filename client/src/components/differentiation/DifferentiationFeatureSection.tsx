import { useEffect, useState } from "react";
import { useScrollAnimations } from "../../utils/animations";

type FeatureProps = {
  number: string;
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
};

const DifferentiationFeatureSection = ({
  number,
  title,
  description,
  imageUrl,
  reverse = false,
}: FeatureProps) => {
  const { stackIn } = useScrollAnimations();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    // Reduced delay for faster animations while maintaining lazy loading compatibility
    const timer = setTimeout(() => {
      // Simple stackIn animation for the feature section
      stackIn(".diff-feature-section", 0.06);
    }, 120);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="w-full bg-black text-white py-12">
      <div
        className={`max-w-[1248px] mx-auto px-4 sm:px-6 md:px-6 flex flex-col md:flex-row items-center ${
          reverse ? "md:flex-row-reverse" : ""
        } gap-8 diff-feature-section`}
      >
        {/* Text Block */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left relative group">
          <span className="text-[96px] font-extrabold text-white opacity-30 leading-none mb-2 group-hover:opacity-40 transition-opacity duration-300 ease-out">
            {number}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300 ease-out">{title}</h3>
          <p className="text-sm md:text-base text-muted-2 leading-relaxed group-hover:opacity-90 group-hover:text-gray-200 transition-all duration-300 ease-out">
            {description}
          </p>
        </div>

        {/* Image Block */}
        <div className="w-full md:w-1/2 group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto rounded-md object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center rounded-md">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-muted">이미지를 불러올 수 없습니다</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DifferentiationFeatureSection;
