import { useEffect, useState } from "react";
import PortfolioCard from "./PortfolioCard";
import type { PortfolioItem } from "../../types/portfolio";
import axios from "axios";

type Props = {
  currentFilter: string;
};

// Map filter keys to actual Korean category names (used in DB)
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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        const response = await axios.get(
          `${API_BASE_URL}/portfolio/category?name=${encodeURIComponent(category)}`
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

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const nextItems = allItems.slice(0, nextPage * ITEMS_PER_PAGE);
    setVisibleItems(nextItems);
    setPage(nextPage);
  };

  const hasMoreItems = visibleItems.length < allItems.length;

  return (
    <section className="max-w-[1248px] mx-auto px-4 py-10 grid gap-6 text-white">
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
          <PortfolioCard key={item._id} item={item} />
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
