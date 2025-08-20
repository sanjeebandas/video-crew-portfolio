const services = [
  {
    title: "Customer-Centric",
    description: "비디오크루가 지향하는 것은 고객의 성공입니다.",
    image: "/imgs/about/image 6.webp",
  },
  {
    title: "Problem Solving",
    description:
      "비디오크루는 디자인 이슈, 제안 컨설팅 등 고객의 문제에 집중합니다.",
    image: "/imgs/about/image 5.webp",
  },
  {
    title: "Candidness",
    description: "업무를 수행함에 있어서 솔직하고 진정성 있게 접근합니다.",
    image: "/imgs/about/image 4.webp",
  },
];

import { useEffect } from "react";
import { useScrollAnimations } from "../../utils/animations";

const AboutGrid = () => {
  const { stackIn } = useScrollAnimations();

  useEffect(() => {
    // About grid animations - stack effect for cards
    stackIn(".about-card", 0.1);
  }, []);

  return (
    <section className="w-full bg-black text-white px-6 py-16">
      <div className="max-w-[1248px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6 place-items-center">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="about-card relative w-[302px] h-[257px] min-[768px]:w-[380px] min-[768px]:h-[320px] min-[1024px]:w-[402px] min-[1024px]:h-[425px] rounded-xs overflow-hidden shadow-md border border-white/10 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl hover:border-blue-400/30 group"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300 ease-out">
              <div className="flex flex-col justify-start gap-2 min-h-[100px]">
                <h3 className="text-base min-[768px]:text-base min-[1024px]:text-lg font-bold group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {service.title}
                </h3>
                <p className="text-xs min-[768px]:text-sm min-[1024px]:text-sm text-gray-200 leading-snug min-[768px]:leading-relaxed min-[1024px]:leading-relaxed group-hover:text-white transition-colors duration-300 ease-out">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutGrid;
