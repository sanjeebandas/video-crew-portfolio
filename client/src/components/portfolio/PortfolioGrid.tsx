import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import PortfolioCard from "./PortfolioCard";
import type { PortfolioItem } from "../../types/portfolio";
import api from "../../services/api";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import LoadingStates from "../common/LoadingStates";

// Custom hook for responsive screen size detection
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

type Props = {
  currentFilter: string;
};

const backendCategoryMap: Record<string, string> = {
  "e-learning": "이러닝 영상",
  "corporate-event": "기업 행사 영상",
  "advertisement/promotional": "광고 · 홍보 영상",
};

// Dynamic items per page based on screen size
const getItemsPerPage = (screenWidth: number) => {
  if (screenWidth < 640) return 6; // Mobile: 1 column × 6 rows
  if (screenWidth < 1024) return 8; // Tablet: 2 columns × 4 rows  
  return 9; // Desktop: 3 columns × 3 rows
};

// Get optimal grid layout based on item count and screen size
const getGridLayout = (itemCount: number, screenWidth: number) => {
  if (itemCount === 1) {
    return 'grid-cols-1 max-w-2xl mx-auto'; // Single video - centered and larger
  }
  
  if (itemCount === 2) {
    return 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'; // Two videos - medium size
  }
  
  // For 3+ items, use responsive grid that adapts to screen size
  if (screenWidth < 640) {
    return 'grid-cols-1'; // Mobile: 1 column
  } else if (screenWidth < 1024) {
    return 'grid-cols-1 sm:grid-cols-2'; // Tablet: 2 columns
  } else {
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'; // Desktop: 3 columns
  }
};

const PortfolioGrid = ({ currentFilter }: Props) => {
  const [allItems, setAllItems] = useState<PortfolioItem[]>([]);
  const [visibleItems, setVisibleItems] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadMoreOperation = useRef(false);
  
  // Get current screen size
  const { width: screenWidth } = useScreenSize();
  const itemsPerPage = getItemsPerPage(screenWidth);

  // Reset pagination when screen size changes
  useEffect(() => {
    if (allItems.length > 0) {
      setVisibleItems(allItems.slice(0, itemsPerPage));
      setPage(1);
    }
  }, [itemsPerPage, allItems]);

  // Enhanced error handling
  const { errorState, handleError, clearError, retry, canRetry } =
    useErrorHandler({
      maxRetries: 3,
      retryDelay: 1000,
      onRetry: () => {
        console.log("Retrying portfolio fetch...");
      },
    });

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      clearError();

      // Clear items *before* fetching new ones to avoid showing stale data
      setAllItems([]);
      setVisibleItems([]);
      setPage(1);

      const startTime = Date.now();

      try {
        const category = backendCategoryMap[currentFilter];

        const response = await api.get(
          `/portfolio/category?name=${encodeURIComponent(category)}`
        );

        const items: PortfolioItem[] = response.data?.data || [];

        const sortedItems = items.sort(
          (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
        );

        setAllItems(sortedItems);
        setVisibleItems(sortedItems.slice(0, itemsPerPage));

        if (sortedItems.length === 0) {
          console.warn("No items found for category:", category);
        }
      } catch (err) {
        console.error("Failed to fetch portfolio items:", err);
        handleError(err);
      } finally {
        // Ensure minimum 0.5-second loading time for better UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsedTime);

        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    fetchItems();
  }, [currentFilter, clearError, handleError]);

  // Smooth animation when cards load - delayed to sync with banner
  useEffect(() => {
    if (visibleItems.length > 0 && !loading && !errorState.hasError && !isLoadMoreOperation.current) {
      // Check if this is initial load or category switch
      const isInitialLoad = allItems.length === 0 && visibleItems.length > 0;

      const delay = isInitialLoad ? 1.2 : 0.2;

      gsap.fromTo(
        ".portfolio-card",
        {
          opacity: 0,
          y: 20,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          delay: delay,
          force3D: true, // Enable hardware acceleration
        }
      );
    }
  }, [visibleItems, loading, errorState.hasError, allItems.length]);

  const handleLoadMore = async () => {
    if (loadingMore) return; // Prevent multiple clicks
    
    // Set flag to prevent initial animation from running
    isLoadMoreOperation.current = true;
    setLoadingMore(true);
    const currentCount = visibleItems.length;
    
    // Simulate a brief loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nextPage = page + 1;
    const nextItems = allItems.slice(0, nextPage * itemsPerPage);
    
    setVisibleItems(nextItems);
    setPage(nextPage);
    setLoadingMore(false);

    // Animate only the NEW cards when loading more
    setTimeout(() => {
      // Get all portfolio cards
      const allCards = document.querySelectorAll('.portfolio-card');
      const newCardsArray = Array.from(allCards).slice(currentCount);
      
      if (newCardsArray.length > 0) {
        // Set initial state for new cards only
        gsap.set(newCardsArray, {
          opacity: 0,
          y: 20,
          scale: 0.98,
        });
        
        // Animate only the new cards
        gsap.to(newCardsArray, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.out",
          force3D: true, // Enable hardware acceleration
        });
      }
      
      // Reset flag after animation completes
      setTimeout(() => {
        isLoadMoreOperation.current = false;
      }, 500);
    }, 50);
  };

  const hasMoreItems = visibleItems.length < allItems.length;

  // Retry function for error handling
  const handleRetry = async () => {
    const category = backendCategoryMap[currentFilter];
    await retry(async () => {
      const response = await api.get(
        `/portfolio/category?name=${encodeURIComponent(category)}`
      );
      const items: PortfolioItem[] = response.data?.data || [];
      const sortedItems = items.sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
      );
      setAllItems(sortedItems);
      setVisibleItems(sortedItems.slice(0, itemsPerPage));
    });
  };

  return (
    <section
      ref={containerRef}
      className="max-w-[1248px] mx-auto px-4 py-10 mb-36 grid gap-6 text-white"
    >
      <LoadingStates
        isLoading={loading}
        error={errorState.error}
        isEmpty={!loading && !errorState.hasError && visibleItems.length === 0}
        onRetry={handleRetry}
        canRetry={canRetry}
        loadingMessage="포트폴리오를 불러오는 중..."
        emptyMessage="이 카테고리에 아직 콘텐츠가 추가되지 않았습니다. 다른 카테고리를 확인해보세요."
      >
        <div className={`grid gap-4 sm:gap-6 ${getGridLayout(visibleItems.length, screenWidth)}`}>
          {visibleItems.map((item) => (
            <div key={item._id} className="portfolio-card">
              <PortfolioCard item={item} />
            </div>
          ))}
        </div>

        {hasMoreItems && (
          <div className="w-full flex justify-center my-8 sm:my-10">
            <div className="max-w-[1248px] w-full flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`${
                  loadingMore 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-semibold py-4 px-14 text-lg rounded-full transition duration-300 flex items-center gap-2`}
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Load More</span>
                )}
              </button>
            </div>
          </div>
        )}
      </LoadingStates>
    </section>
  );
};

export default PortfolioGrid;
