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
  // Duplicate 4 times for smoother looping
  const loopCompanies = [
    ...companies,
    ...companies,
    ...companies,
    ...companies,
  ];

  return (
    <div className="w-full overflow-hidden bg-black">
      <div className="scroll-wrapper relative flex items-center">
        <div className="scroll-track flex gap-16 company-animate-scroll-left">
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
    <div className="flex-shrink-0">
      {!error ? (
        <img
          src={logo}
          alt={name}
          className="h-auto w-auto object-contain hover:scale-110 hover:opacity-80 transition-transform duration-300"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-white/70 text-xl font-semibold">{name}</span>
      )}
    </div>
  );
}
