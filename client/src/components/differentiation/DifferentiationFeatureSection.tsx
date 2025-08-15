type FeatureProps = {
  number: string;
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
};

const DifferentiationFeatureSection = ({
  number,
  title,
  description,
  imageUrl,
  reverse = false,
}: FeatureProps) => {
  return (
    <section className="w-full bg-black text-white py-12">
      <div
        className={`max-w-[1248px] mx-auto px-4 sm:px-6 md:px-0 flex flex-col md:flex-row items-center ${
          reverse ? "md:flex-row-reverse" : ""
        } gap-8`}
      >
        {/* Text Block */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left relative group">
          <span className="text-[96px] font-extrabold text-white opacity-15 leading-none mb-2 group-hover:opacity-25 transition-opacity duration-300 ease-out">
            {number}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300 ease-out">{title}</h3>
          <p className="text-sm md:text-base opacity-70 leading-relaxed group-hover:opacity-90 group-hover:text-gray-200 transition-all duration-300 ease-out">
            {description}
          </p>
        </div>

        {/* Image Block */}
        <div className="w-full md:w-1/2 group hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default DifferentiationFeatureSection;
