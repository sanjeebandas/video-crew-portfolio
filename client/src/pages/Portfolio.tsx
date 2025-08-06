import { useState } from "react";
import PortfolioBanner from "../components/portfolio/PortfolioBanner";
import PortfolioGrid from "../components/portfolio/PortfolioGrid";

// Updated category keys and labels
const categories = [
  { label: "광고 · 홍보 영상", value: "advertisement/promotional" },
  { label: "이러닝 영상", value: "e-learning" },
  { label: "기업 행사 영상", value: "corporate-event" },
];

const Portfolio = () => {
  const [currentFilter, setCurrentFilter] = useState(
    "advertisement/promotional"
  );

  return (
    <div className="bg-black">
      <PortfolioBanner
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        categories={categories}
      />
      <PortfolioGrid currentFilter={currentFilter} />
    </div>
  );
};

export default Portfolio;
