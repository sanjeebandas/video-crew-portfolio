const services = [
  {
    title: "Creative Solutions",
    description:
      "틀에 박힌 형식이 아닌, 메시지의 최적화를 돕는 독창적인 아이디어를 제시합니다.",
    image: "/imgs/image 3.webp",
  },
  {
    title: "Professional Quality",
    description:
      "대기업과 협업했던 전문 컨설턴트들이 기획하며, 최신 장비와 기술력을 바탕으로 모든 프로젝트에 최상의 퀄리티를 보장합니다.",
    image: "/imgs/image 2.webp",
  },
  {
    title: "All-in-One Service",
    description:
      "복잡한 영상 제작 과정, 비디오크루에서는 기획부터 최종 발표까지 원스톱으로 책임져 드립니다.",
    image: "/imgs/image 1.webp",
  },
];

const ServicesGrid = () => {
  return (
    <section className="w-full bg-black text-white px-6 py-16">
      <div className="max-w-[1248px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="relative w-[90vw] max-w-[302px] sm:max-w-[360px] md:max-w-[402px] h-[195px] sm:h-[300px] md:h-[425px] rounded-md overflow-hidden shadow-md border border-white/10 transition-transform duration-300 ease-in-out hover:-translate-y-3"
          >
            {/* Image fills the card */}
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay (aligned like AboutGrid) */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              <div className="flex flex-col justify-start gap-2 min-h-[10px] md:min-h-[100px]">
                <h3 className="text-xs md:text-lg font-bold">
                  {service.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-200 leading-snug md:leading-relaxed">
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

export default ServicesGrid;
