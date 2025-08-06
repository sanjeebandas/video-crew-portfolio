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
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left relative">
          <span className="text-[96px] font-extrabold text-white opacity-15 leading-none mb-2">
            {number}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
          <p className="text-sm md:text-base opacity-70 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Image Block */}
        <div className="w-full md:w-1/2">
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
