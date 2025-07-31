
import AboutHero from "../components/about/AboutHero";

type Props = {};

const About = (props: Props) => {
  return (
    <div>
      <section className="bg-black text-white w-full px-6 py-12">
        <div className="max-w-[1248px] mx-auto flex flex-col md:flex-row justify-between items-start md:space-x-12 space-y-10 md:space-y-0">
          {/* Left Title Block */}
          <div className="w-full md:flex-1 text-center md:text-left">
            <p className="text-sm text-gray-400 mb-2">Who we are, Video Crew</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
              스토리로 말하는 영상 콘텐츠,
              <br />
              시선을 사로잡는 영상,
              <br />더 이상 고민하지 마세요!
            </h2>
          </div>

          {/* Right Paragraph Block */}
          <div className="w-full md:flex-1 text-sm  text-gray-300 leading-relaxed text-center md:text-justify md:mt-8">
            우리는 영상이 단순히 기술적인 가치가 있다고 생각하지 않습니다.
            우리에게는 각각 걸어온 하나의 경험을 나타냅니다. 비디오크루는,
            브랜드 스토리를 강력하고 인상적인 모습의 이야기로 일련의 작업물을
            거쳐 제작한 내용들이 우리가 가지고 있는 비전입니다.
            <br />
            <br />
            "모든 프로젝트에 가치를 담아" 고객과 함께 성장하는 파트너가
            되겠습니다.
          </div>
        </div>
      </section>

      {/* HeroSection of About Page */}
      <AboutHero />
    </div>
  );
};

export default About;
