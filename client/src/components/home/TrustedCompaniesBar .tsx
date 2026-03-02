
const companyLogos = [
  { src: "/imgs/logos/hyundai.webp", alt: "Hyundai" },
  { src: "/imgs/logos/kia.webp", alt: "Kia" },
  { src: "/imgs/logos/samsung.webp", alt: "Samsung" },
  { src: "/imgs/logos/lg.webp", alt: "LG" },
];

const TrustedCompaniesBar = () => {
  return (
    <section className="w-full bg-black text-white overflow-hidden py-6 2xl:py-8 3xl:py-10">
      {/* Top Divider */}
      <div className="h-px bg-white/20 w-full mb-1 2xl:mb-2" />

      {/* Scrolling Logo Row - Full width, logos scale on ultra-wide */}
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll-left gap-16 2xl:gap-20 3xl:gap-24 whitespace-nowrap">
          {/* Triple the logos on ultra-wide for smoother infinite scroll */}
          {Array(3)
            .fill(companyLogos)
            .flat()
            .map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-10 md:h-12 2xl:h-14 3xl:h-16 object-contain grayscale opacity-80 hover:opacity-100 transition duration-300"
              />
            ))}
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="h-px bg-white/20 w-full mt-1 2xl:mt-2" />
    </section>
  );
};

export default TrustedCompaniesBar;
