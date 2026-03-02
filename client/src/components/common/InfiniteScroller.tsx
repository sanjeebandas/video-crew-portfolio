import { useState } from "react";

type Company = {
  name: string;
  logo: string;
};

const companies: Company[] = [
  { name: "KIA", logo: "/imgs/companies/kia-logo.webp" },
  { name: "HYUNDAI", logo: "/imgs/companies/hyundai-logo.webp" },
  { name: "SAMSUNG", logo: "/imgs/companies/samsung.svg" },
  { name: "STARBUCKS", logo: "/imgs/companies/starbucks-logo.webp" },
  { name: "multicampus", logo: "/imgs/companies/multicampus-logo.webp" },
];

export default function InfiniteScroller() {
  // Duplicate 5 times for smoother looping on large screens
  const loopCompanies = [
    ...companies,
    ...companies,
    ...companies,
    ...companies,
    ...companies,
  ];

  return (
    // Full-width scroller - content scales on ultra-wide screens
    <div className="company-scroller-container w-full overflow-hidden bg-black py-3 sm:py-4">
      <div className="scroll-wrapper relative flex items-center">
        {/* Gap scales on ultra-wide for better spacing */}
        <div className="scroll-track flex gap-10 xs:gap-12 sm:gap-14 md:gap-16 company-animate-scroll-left">
          {loopCompanies.map((company, idx) => (
            <CompanyItem key={`${company.name}-${idx}`} {...company} />
          ))}
        </div>
      </div>

      {/* Local keyframes (no global CSS changes required) */}
      <style>
        {`
          @keyframes scrollCycle {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scrollCycle 25s linear infinite;
          }
        `}
      </style>
    </div>
  );
}

function CompanyItem({ name, logo }: Company) {
  const [error, setError] = useState(false);

  return (
    // Logo size scales up on ultra-wide (1920px+)
    <div className="flex-shrink-0">
      {!error ? (
        <img
          src={logo}
          alt={name}
          className="company-logo h-6 xs:h-7 sm:h-8 w-auto object-contain hover:scale-110 hover:opacity-80 transition-transform duration-300"
          onError={() => setError(true)}
        />
      ) : (
        <span className="company-logo-fallback text-white/70 text-base xs:text-lg sm:text-xl font-semibold">{name}</span>
      )}
    </div>
  );
}
