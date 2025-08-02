import React from "react";

type Props = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  reverse?: boolean;
  offsetY?: string;
};

const ProcessStep = ({
  id,
  title,
  subtitle,
  description,
  image,
  reverse = false,
  offsetY = "",
}: Props) => {
  return (
    <div className="w-full">
      <div
        className={`relative w-full max-w-[1248px] mx-auto flex flex-col md:flex-row items-start ${
          reverse ? "md:items-end md:justify-end" : ""
        } ${offsetY}`}
      >
        {/* Step Number */}
        <div
          className={`absolute text-[120px] md:text-[150px] font-extrabold text-white opacity-10 z-0
            ${
              reverse
                ? "left-0 -translate-x-[6px] -top-16 md:right-0 md:left-auto md:translate-x-[6px] md:-top-20"
                : "left-0 -translate-x-[6px] -top-16 md:-top-20"
            }`}
        >
          {id}
        </div>

        {/* Image with text overlay */}
        <div
          className={`relative z-10 w-full md:w-[585px] mt-20 md:mt-24 ${
            reverse
              ? "md:ml-auto md:translate-x-[6px]"
              : "md:-translate-x-[6px]"
          }`}
        >
          <div className="relative">
            <img
              src={image}
              alt={`Process ${id}`}
              className="w-full h-auto object-cover"
            />

            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
              <p className="text-base font-semibold">{title}</p>
              <p className="text-[15px] font-bold">({subtitle})</p>
              <p className="text-sm opacity-80 mt-1">
                {description}
                <span className="font-bold cursor-pointer ml-1">See more</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;
