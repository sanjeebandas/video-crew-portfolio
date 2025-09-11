import { useState, useMemo } from "react";

type Props = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  reverse?: boolean;
  offsetY?: string;
};

const ProcessStep = ({
  id,
  title,
  subtitle,
  description,
  image,
  reverse = false,
  offsetY = "",
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Responsive character limits for text truncation
  const getCharacterLimit = () => {
    // Mobile: ~60 chars, Tablet: ~80 chars, Desktop: ~100 chars
    return {
      mobile: 50,
      tablet: 70,
      desktop: 90
    };
  };

  // Process description with truncation logic
  const processedDescription = useMemo(() => {
    const limits = getCharacterLimit();
    const fullText = description;
    
    // Check if text needs truncation (this should always be based on original text length)
    const needsTruncation = fullText.length > limits.mobile;
    
    if (!needsTruncation) {
      return {
        displayText: fullText,
        needsTruncation: false
      };
    }

    if (isExpanded) {
      return {
        displayText: fullText,
        needsTruncation: true // Keep this true so button shows
      };
    }

    // Find a good truncation point (end of sentence or word)
    let truncateAt = limits.mobile;
    const text = fullText.substring(0, limits.mobile);
    
    // Try to break at sentence end
    const lastSentenceEnd = Math.max(
      text.lastIndexOf('.'),
      text.lastIndexOf('!'),
      text.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > limits.mobile * 0.7) {
      truncateAt = lastSentenceEnd + 1;
    } else {
      // Break at word boundary
      const lastSpace = text.lastIndexOf(' ');
      if (lastSpace > limits.mobile * 0.8) {
        truncateAt = lastSpace;
      }
    }

    return {
      displayText: fullText.substring(0, truncateAt).trim(),
      needsTruncation: true
    };
  }, [description, isExpanded]);

  return (
    <div className="w-full">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="relative w-full max-w-[1248px] mx-auto flex flex-col items-start">
          {/* Step Number */}
          <div className="absolute text-[120px] font-extrabold text-white opacity-30 pointer-events-none left-0 -translate-x-[6px] -top-16">
            {id}
          </div>

          {/* Image with text overlay */}
          <div className="relative z-20 w-full mt-20">
            <div className="relative group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
              {!imageError ? (
                <img
                  src={image}
                  alt={`Process ${id}`}
                  className="w-full h-auto object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-[200px] bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">이미지 로드 실패</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <p className="text-base font-semibold group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {title}
                </p>
                <p className="text-[15px] font-bold group-hover:text-blue-300 transition-colors duration-300 ease-out">
                  ({subtitle})
                </p>
                <p className="text-sm opacity-80 mt-1 group-hover:opacity-100 transition-all duration-500 ease-out">
                  {processedDescription.displayText.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < processedDescription.displayText.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  {processedDescription.needsTruncation && (
                    <span 
                      className="font-bold cursor-pointer ml-1 group-hover:text-blue-400 hover:underline transition-all duration-300 ease-out"
                      onClick={toggleExpanded}
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout - Including iPad Pro (1024x1366) */}
      <div className="hidden md:block xl:hidden">
        <div className="relative w-full max-w-[1248px] mx-auto flex flex-col items-start">
          {/* Step Number */}
          <div className="absolute text-[120px] font-extrabold text-white opacity-30 pointer-events-none left-0 -translate-x-[6px] -top-16">
            {id}
          </div>

          {/* Image with text overlay */}
          <div className="relative z-20 w-full mt-20">
            <div className="relative group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
              {!imageError ? (
                <img
                  src={image}
                  alt={`Process ${id}`}
                  className="w-full h-auto object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-[250px] bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">이미지 로드 실패</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <p className="text-base font-semibold group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {title}
                </p>
                <p className="text-[15px] font-bold group-hover:text-blue-300 transition-colors duration-300 ease-out">
                  ({subtitle})
                </p>
                <p className="text-sm opacity-80 mt-1 group-hover:opacity-100 transition-all duration-500 ease-out">
                  {processedDescription.displayText.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < processedDescription.displayText.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  {processedDescription.needsTruncation && (
                    <span 
                      className="font-bold cursor-pointer ml-1 group-hover:text-blue-400 hover:underline transition-all duration-300 ease-out"
                      onClick={toggleExpanded}
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Only for larger screens */}
      <div className="hidden xl:block">
        <div
          className={`relative w-full max-w-[1248px] mx-auto flex flex-row items-start ${
            reverse ? "items-end justify-end" : ""
          } ${offsetY}`}
        >
          {/* Step Number */}
          <div
            className={`absolute text-[150px] font-extrabold text-white opacity-30 pointer-events-none
               ${
                 reverse
                   ? "right-0 left-auto translate-x-[6px] -top-20"
                   : "left-0 -translate-x-[6px] -top-20"
               }`}
          >
            {id}
          </div>

          {/* Image with text overlay */}
          <div
            className={`relative z-20 w-[585px] mt-24 ${
              reverse
                ? "ml-auto translate-x-[6px]"
                : "-translate-x-[6px]"
            }`}
          >
            <div className="relative group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
              {!imageError ? (
                <img
                  src={image}
                  alt={`Process ${id}`}
                  className="w-full h-auto object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">이미지 로드 실패</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <p className="text-base font-semibold group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {title}
                </p>
                <p className="text-[15px] font-bold group-hover:text-blue-300 transition-colors duration-300 ease-out">
                  ({subtitle})
                </p>
                <p className="text-sm opacity-80 mt-1 group-hover:opacity-100 transition-all duration-500 ease-out">
                  {processedDescription.displayText.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < processedDescription.displayText.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  {processedDescription.needsTruncation && (
                    <span 
                      className="font-bold cursor-pointer ml-1 group-hover:text-blue-400 hover:underline transition-all duration-300 ease-out"
                      onClick={toggleExpanded}
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;
