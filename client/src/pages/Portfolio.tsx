import { useState } from "react";
import PortfolioBanner from "../components/portfolio/PortfolioBanner";
import PortfolioGrid from "../components/portfolio/PortfolioGrid";
import SEO from "../components/common/SEO";
import ErrorBoundary from "../components/common/ErrorBoundary";

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
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Portfolio page error:', error, errorInfo);
            // You can add error reporting here (e.g., Sentry, LogRocket, etc.)
          }}
        >
          <PortfolioBanner
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            categories={categories}
          />
          <ErrorBoundary
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold mb-2">포트폴리오를 불러올 수 없습니다</h3>
                  <p className="text-gray-400">페이지를 새로고침해주세요.</p>
                </div>
              </div>
            }
          >
            <PortfolioGrid currentFilter={currentFilter} />
          </ErrorBoundary>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Portfolio;
