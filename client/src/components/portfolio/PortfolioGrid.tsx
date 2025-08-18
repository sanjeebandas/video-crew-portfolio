import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import PortfolioCard from "./PortfolioCard";
import type { PortfolioItem } from "../../types/portfolio";
import api from "../../services/api";

type Props = {
  currentFilter: string;
};

const backendCategoryMap: Record<string, string> = {
  "advertisement/promotional": "광고 · 홍보 영상",
  "e-learning": "이러닝 영상",
  "corporate-event": "기업 행사 영상",
};

const ITEMS_PER_PAGE = 5;

const PortfolioGrid = ({ currentFilter }: Props) => {
  const [allItems, setAllItems] = useState<PortfolioItem[]>([]);
  const [visibleItems, setVisibleItems] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      // Clear items *before* fetching new ones to avoid showing stale data
      setAllItems([]);
      setVisibleItems([]);
      setPage(1);

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
        setVisibleItems(sortedItems.slice(0, ITEMS_PER_PAGE));

        if (sortedItems.length === 0) {
          console.warn("No items found for category:", category);
        }
      } catch (err) {
        console.error("Failed to fetch portfolio items:", err);
        setError("콘텐츠를 불러올 수 없습니다. 다시 시도해주세요."); // "Failed to load content. Please try again."
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentFilter]);

  // Smooth animation when cards load - delayed to sync with banner
  useEffect(() => {
    if (visibleItems.length > 0 && !loading && !error) {
      // Check if this is initial load or category switch
      const isInitialLoad = allItems.length === 0 && visibleItems.length > 0;
      
      // Different delays for initial load vs category switch
      const delay = isInitialLoad ? 1.2 : 0.3; // Initial load waits for banner, category switch is faster
      
      gsap.fromTo(
        ".portfolio-card",
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.95 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: delay
        }
      );
    }
  }, [visibleItems, loading, error, allItems.length]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const nextItems = allItems.slice(0, nextPage * ITEMS_PER_PAGE);
    setVisibleItems(nextItems);
    setPage(nextPage);
    
    // Animate new cards when loading more
    setTimeout(() => {
      gsap.fromTo(
        ".portfolio-card",
        { 
          opacity: 0, 
          y: 20, 
          scale: 0.98 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out"
        }
      );
    }, 100);
  };

  const hasMoreItems = visibleItems.length < allItems.length;

  return (
    <section ref={containerRef} className="max-w-[1248px] mx-auto px-4 py-10 grid gap-6 text-white">
      {loading && <p className="text-center">로딩 중...</p>}

      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <p className="text-center text-white opacity-80">
          해당 카테고리에 콘텐츠가 없습니다.
        </p>
      )}

      <div className="flex flex-col gap-6">
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300"
            >
              (Load More )더 보기
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioGrid;
