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
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="relative w-full max-w-[1248px] mx-auto flex flex-col items-start">
          {/* Step Number */}
          <div className="absolute text-[120px] font-extrabold text-white opacity-10 pointer-events-none left-0 -translate-x-[6px] -top-16">
            {id}
          </div>

          {/* Image with text overlay */}
          <div className="relative z-20 w-full mt-20">
            <div className="relative group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
              <img
                src={image}
                alt={`Process ${id}`}
                className="w-full h-auto object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <p className="text-base font-semibold group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {title}
                </p>
                <p className="text-[15px] font-bold group-hover:text-blue-300 transition-colors duration-300 ease-out">
                  ({subtitle})
                </p>
                <p className="text-sm opacity-80 mt-1 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  {description}
                  <span className="font-bold cursor-pointer ml-1 group-hover:text-blue-400 hover:underline transition-all duration-300 ease-out">
                    See more
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout - Including iPad Pro (1024x1366) */}
      <div className="hidden md:block xl:hidden">
        <div className="relative w-full max-w-[1248px] mx-auto flex flex-col items-start">
          {/* Step Number */}
          <div className="absolute text-[120px] font-extrabold text-white opacity-10 pointer-events-none left-0 -translate-x-[6px] -top-16">
            {id}
          </div>

          {/* Image with text overlay */}
          <div className="relative z-20 w-full mt-20">
            <div className="relative group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
              <img
                src={image}
                alt={`Process ${id}`}
                className="w-full h-auto object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <p className="text-base font-semibold group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {title}
                </p>
                <p className="text-[15px] font-bold group-hover:text-blue-300 transition-colors duration-300 ease-out">
                  ({subtitle})
                </p>
                <p className="text-sm opacity-80 mt-1 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  {description}
                  <span className="font-bold cursor-pointer ml-1 group-hover:text-blue-400 hover:underline transition-all duration-300 ease-out">
                    See more
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Only for larger screens */}
      <div className="hidden xl:block">
        <div
          className={`relative w-full max-w-[1248px] mx-auto flex flex-row items-start ${
            reverse ? "items-end justify-end" : ""
          } ${offsetY}`}
        >
          {/* Step Number */}
          <div
            className={`absolute text-[150px] font-extrabold text-white opacity-10 pointer-events-none
               ${
                 reverse
                   ? "right-0 left-auto translate-x-[6px] -top-20"
                   : "left-0 -translate-x-[6px] -top-20"
               }`}
          >
            {id}
          </div>

          {/* Image with text overlay */}
          <div
            className={`relative z-20 w-[585px] mt-24 ${
              reverse
                ? "ml-auto translate-x-[6px]"
                : "-translate-x-[6px]"
            }`}
          >
            <div className="relative group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
              <img
                src={image}
                alt={`Process ${id}`}
                className="w-full h-auto object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <p className="text-base font-semibold group-hover:text-blue-400 transition-colors duration-300 ease-out">
                  {title}
                </p>
                <p className="text-[15px] font-bold group-hover:text-blue-300 transition-colors duration-300 ease-out">
                  ({subtitle})
                </p>
                <p className="text-sm opacity-80 mt-1 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  {description}
                  <span className="font-bold cursor-pointer ml-1 group-hover:text-blue-400 hover:underline transition-all duration-300 ease-out">
                    See more
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;
