import React from 'react';

interface LoadingStatesProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  canRetry?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({
  isLoading,
  error,
  isEmpty,
  onRetry,
  canRetry = true,
  loadingMessage = "로딩 중...",
  emptyMessage = "콘텐츠가 없습니다.",
  children,
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center">
          {/* Spinner - centered */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          
          {/* Loading text - centered below spinner */}
          <div className="text-center">
            <p className="text-white text-lg font-medium">{loadingMessage}</p>
            <p className="text-gray-400 text-sm mt-1">잠시만 기다려주세요...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          {/* Error icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          {/* Error message */}
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            오류가 발생했습니다
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          
          {/* Retry button */}
          {canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          {/* Empty state icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          {/* Empty state message */}
          <h3 className="text-lg font-semibold text-white mb-2">
            콘텐츠가 없습니다
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Show content
  return <>{children}</>;
};

export default LoadingStates;
