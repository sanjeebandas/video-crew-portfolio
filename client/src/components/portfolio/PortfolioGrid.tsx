import { useEffect, useState } from "react";
import PortfolioCard from "./PortfolioCard";
import type { PortfolioItem } from "../../types/portfolio";

type Props = {
  currentFilter: string;
};

const categoryMap: Record<string, string[]> = {
  "광고 · 홍보 영상": ["Advertisement", "Promotional", "Commercial"],
  "이커머스 영상": ["E-commerce"],
  "기업 행사 영상": ["Corporate", "Event"],
};

// 🧪 Mock Data for testing pagination (8 items total)
const mockPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Promo Video 1",
    category: "Promotional",
    client: "Client A",
    description: "A promotional video for a product launch.",
    thumbnailUrl: "imgs/sample image1.jpg",
    videoUrl: "/video1.mp4",
    featured: true,
    displayOrder: 1,
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "E-commerce Ad",
    category: "E-commerce",
    client: "Client B",
    description: "Ad for an e-commerce website.",
    thumbnailUrl: "/thumb2.jpg",
    videoUrl: "/video2.mp4",
    featured: false,
    displayOrder: 2,
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
  },
  {
    id: 3,
    title: "Corporate Summit",
    category: "Corporate",
    client: "Client C",
    description: "Highlights from a corporate summit event.",
    thumbnailUrl: "/thumb3.jpg",
    videoUrl: "/video3.mp4",
    featured: false,
    displayOrder: 3,
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
  },
  {
    id: 4,
    title: "Promo Video 3",
    category: "Promotional",
    client: "Client E",
    description: "A high-energy promo for a summer campaign.",
    thumbnailUrl: "/thumb4.jpg",
    videoUrl: "/video4.mp4",
    featured: false,
    displayOrder: 4,
    createdAt: "2025-08-02T09:00:00Z",
    updatedAt: "2025-08-02T09:00:00Z",
  },
  {
    id: 5,
    title: "Promo Video 4",
    category: "Promotional",
    client: "Client F",
    description: "Stylish promotional ad for a fashion brand.",
    thumbnailUrl: "/thumb5.jpg",
    videoUrl: "/video5.mp4",
    featured: false,
    displayOrder: 5,
    createdAt: "2025-08-02T11:00:00Z",
    updatedAt: "2025-08-02T11:00:00Z",
  },
  {
    id: 6,
    title: "Promo Video 5",
    category: "Promotional",
    client: "Client G",
    description: "Promotional launch video for new tech product.",
    thumbnailUrl: "/thumb6.jpg",
    videoUrl: "/video6.mp4",
    featured: false,
    displayOrder: 6,
    createdAt: "2025-08-02T12:00:00Z",
    updatedAt: "2025-08-02T12:00:00Z",
  },
  {
    id: 7,
    title: "Promo Video 6",
    category: "Promotional",
    client: "Client H",
    description: "An engaging promo for a digital service.",
    thumbnailUrl: "/thumb7.jpg",
    videoUrl: "/video7.mp4",
    featured: false,
    displayOrder: 7,
    createdAt: "2025-08-02T13:00:00Z",
    updatedAt: "2025-08-02T13:00:00Z",
  },
  {
    id: 8,
    title: "Promo Video 7",
    category: "Promotional",
    client: "Client I",
    description: "A crisp promotional teaser for social media.",
    thumbnailUrl: "/thumb8.jpg",
    videoUrl: "/video8.mp4",
    featured: false,
    displayOrder: 8,
    createdAt: "2025-08-02T14:00:00Z",
    updatedAt: "2025-08-02T14:00:00Z",
  },
];

const ITEMS_PER_PAGE = 5;

const PortfolioGrid = ({ currentFilter }: Props) => {
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<PortfolioItem[]>([]);

  const getFilteredItems = () => {
    const allowedCategories = categoryMap[currentFilter] || [];
    return mockPortfolioItems.filter((item) =>
      allowedCategories.includes(item.category)
    );
  };

  const filteredItems = getFilteredItems();

  useEffect(() => {
    // 🔄 Reset on filter change
    setPage(1);
    setVisibleItems(filteredItems.slice(0, ITEMS_PER_PAGE));
  }, [currentFilter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const nextItems = filteredItems.slice(0, nextPage * ITEMS_PER_PAGE);
    setVisibleItems(nextItems);
    setPage(nextPage);
  };

  const hasMoreItems = visibleItems.length < filteredItems.length;

  return (
    <section className="max-w-[1248px] mx-auto px-4 py-10 grid gap-6">
      <div className="flex flex-col gap-6">
        {visibleItems.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>

      {hasMoreItems && (
        <div className="w-full flex justify-center my-8 sm:my-10">
          <div className="max-w-[1248px] w-full flex justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300"
            >
              (Load More )더 보기 {/* Load More in Korean */}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioGrid;
