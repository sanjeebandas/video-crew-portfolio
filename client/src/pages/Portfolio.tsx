import { useState } from "react";
import PortfolioBanner from "../components/portfolio/PortfolioBanner";
import PortfolioGrid from "../components/portfolio/PortfolioGrid";

const categories = ["광고 · 홍보 영상", "이커머스 영상", "기업 행사 영상"];
const Portfolio = () => {
  const [currentFilter, setCurrentFilter] = useState(categories[0]); // ✅ Default to first category

  return (
    <div className="bg-black">
      <PortfolioBanner
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />
      <PortfolioGrid currentFilter={currentFilter} />
    </div>
  );
};

export default Portfolio;
