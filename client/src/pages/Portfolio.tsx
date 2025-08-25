import { useState } from "react";
import PortfolioBanner from "../components/portfolio/PortfolioBanner";
import PortfolioGrid from "../components/portfolio/PortfolioGrid";
import SEO from "../components/common/SEO";

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
    <>
      <SEO 
        title="포트폴리오"
        description="비디오크루의 다양한 포트폴리오를 확인하세요. 광고·홍보 영상, 이러닝 영상, 기업 행사 영상 등 다양한 분야의 고품질 영상 제작 사례를 보실 수 있습니다."
        keywords="비디오크루포트폴리오, 광고영상, 홍보영상, 이러닝영상, 기업행사영상, 영상제작사례, 비디오제작포트폴리오"
      />
      <div className="bg-black">
        <PortfolioBanner
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          categories={categories}
        />
        <PortfolioGrid currentFilter={currentFilter} />
      </div>
    </>
  );
};

export default Portfolio;
