import ProcessBanner from "../process/ProcessBanner";
import ProcessStep from "../process/ProcessStep";
import SEO from "../components/common/SEO";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { refreshGSAPAnimations } from "../utils/animations";
import LazyImage from "../components/common/LazyImage";

const Process = () => {
  return (
    <>
      <SEO
        title="제작 프로세스"
        description="비디오크루의 전문적인 영상 제작 프로세스를 소개합니다. 상담 및 목표 설정부터 최종 납품까지, 체계적이고 전문적인 6단계 제작 과정으로 고품질 영상을 제작합니다."
        keywords="영상제작프로세스, 비디오제작과정, 상담목표설정, 영상기획, 촬영준비, 현장촬영, 편집후반작업, 최종납품, 비디오크루프로세스"
      />
      <div className="bg-black text-white relative overflow-hidden">
        <ProcessBanner />
        {/* Decorative Centered Separator Image */}
        <div className="w-full -mt-16 sm:mt-6 md:-mt-24 lg:-mt-28">
          <LazyImage
            src="/imgs/Image.webp"
            alt="비디오크루 Core Value 섹션 구분 디자인 이미지"
            className="w-full h-auto object-cover process-separator"
            onImageLoad={() => {
              // Re-trigger separator animations after image loads
              refreshGSAPAnimations(".process-separator");
            }}
          />
        </div>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("Process page error:", error, errorInfo);
          }}
        >
          <ProcessStep />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Process;
