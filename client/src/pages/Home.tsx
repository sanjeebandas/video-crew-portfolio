import React from "react";
import HeroSection from "../components/home/HeroSection";
import ServicesGrid from "../components/home/ServicesGrid";
import PortfolioScroller from "../components/home/PortfolioScroller";
import TrustedCompaniesBar from "../components/home/TrustedCompaniesBar ";
import BackgroundBanner from "../components/home/BackgroundBanner";
import BlobBackground from "../components/common/BlobBackground";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="relative overflow-hidden">
      {/* ✅ Reusable decorative background */}
      <BlobBackground />
      <HeroSection />
      {/* This NEW Section comes after Hero */}
      <section className="bg-black text-white w-full px-6 py-20">
        <div className="max-w-[1248px] mx-auto flex flex-col md:flex-row justify-between items-start md:space-x-12 space-y-10 md:space-y-0">
          {/* Left Title Block */}
          <div className="w-full md:flex-1 text-center md:text-left">
            <p className="text-sm text-gray-400 mb-2">비디오크루의 차별점</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
              영상 제작, 어떻게
              <br />
              하고 계신가요?
            </h2>
          </div>

          {/* Right Paragraph Block */}
          <div className="w-full md:flex-1 text-sm sm:text-base text-gray-300 leading-relaxed text-center md:text-justify">
            비디오크루는 단순한 영상 제작을 넘어, 강력한 스토리텔링과 독창적인
            시각적 표현으로 고객의 메시지설명력을 높여주는 비디오 콘텐츠 전문
            그룹입니다. 기획부터 촬영, 편집, 그리고 최종 결과물에 이르기까지, 각
            분야의 전문가들이 고객의 비전을 현실도 높은 영상으로 구현합니다.
          </div>
        </div>
      </section>

      {/* This comes AFTER the paragraph block */}
      <ServicesGrid />
      {/* Decorative Separator Image after Services */}
      <img
        src="/imgs/Image.webp"
        alt="Section Separator Design"
        className="w-full h-auto object-cover mb-6
             -mt-20 sm:-mt-32 md:-mt-48"
      />

      <PortfolioScroller />
      {/* Browse Portfolio Button */}
      <div className="w-full flex justify-center my-8 sm:my-10">
        <div className="max-w-[1248px] w-full flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
            포트폴리오 둘러보기
          </button>
        </div>
      </div>

      {/* Decorative Separator Image after PortfolioScroller */}
      <img
        src="/imgs/Image-1.webp"
        alt="Section Separator Design"
        className="w-full h-auto object-cover -mt-6 sm:-mt-10"
      />

      {/* Trusted by Companies Text Block */}
      <div className="w-full text-center text-white -mt-4 sm:-mt-28 mb-12 px-4">
        <h2 className="text-lg md:text-3xl font-bold leading-snug">
          이미 수많은 기업이 <br />
          비디오크루와 함께 하고 있습니다.
        </h2>
      </div>
      <TrustedCompaniesBar />
      <BackgroundBanner />
    </div>
  );
};

export default Home;
