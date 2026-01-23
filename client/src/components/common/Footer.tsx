const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white px-2 3xl:px-4 py-10 text-sm">
      <div className="max-w-[1248px] 2xl:max-w-[1380px] 3xl:max-w-[1600px] mx-auto flex flex-col gap-6">
        {/* Logo Section */}
        <div className="-ml-1 md:ml-0 lg:-ml-4 3xl:ml-0">
          <img src="imgs/Frame 362.png" alt="Video Crew" className="h-14" />
        </div>

        {/* Description */}
        <div className="leading-relaxed text-gray-300 space-y-2 text-xs sm:text-md">
          <p>
            <strong>비디오크루(Video Crew)</strong>는 (주)러닝크루 컨설팅 그룹의
            영상 제작 브랜드입니다.
            <br />
            Learning Crew Consulting Group{" "}
          </p>

          {/* Business Registration & Address & Email */}
          <p>
            사업자 등록번호. 393-88-01627
            <br />
            주소. 서울 성동구 연무장5가길 7 (성수동2가, 성수역 현대테라스타워)
            W1001호-1003호
            <br />
            이메일.{" "}
            <a href="mailto:info@learning-crew.com" className="">
              info@learning-crew.com
            </a>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © 2022. Learning Crew all rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
