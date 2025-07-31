import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="bg-[#111111] text-white px-6 py-10 text-sm">
      <div className="max-w-[1248px] mx-auto flex flex-col gap-6">
        {/* Logo Section */}
        <div>
          <img src="/logo-video-crew.svg" alt="Video Crew" className="h-6" />
        </div>

        {/* Description */}
        <div className="leading-relaxed text-gray-300 space-y-2 text-xs sm:text-md">
          <p>
            <strong>비디오크루(Video Crew)</strong>는 (주)러닝크루 컨설팅 그룹의
            영상 전문 브랜드입니다.
            <br />
            러닝크루 컨설팅그룹{" "}
            <span className="underline underline-offset-2">
              공식 홈페이지 바로가기
            </span>
          </p>

          {/* Address & Email */}
          <p>
            주소. 서울 성동구 연무장5가길 7(성수동2가, 성수역 현대테라스타워)
            1001호~1003호
            <br />
            이메일 |{" "}
            <a href="mailto:info@learning-crew.com" className="underline">
              info@learning-crew.com
            </a>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © 2025. Video Crew all rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
