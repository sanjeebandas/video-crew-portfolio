const DifferentiationHero = () => {
  return (
    <section className="w-full bg-black text-white py-2 md:py-6">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 md:px-0">
        <div className="flex justify-center md:justify-start">
          <div className="relative w-[302px] h-[265px] md:w-full md:h-[588px] rounded-xs overflow-hidden">
            {/* Banner Image */}
            <img
              src="/imgs/differentiation/Frame 424.webp" // ✅ Make sure this path is correct
              alt="Differentiation Banner"
              className="w-full h-full object-cover rounded-xs"
            />

            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2
             md:left-10 md:translate-x-0 md:bottom-6"
            >
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full ${
                    i === 0
                      ? "w-2.5 h-2.5 border-2 border-white"
                      : "w-2 h-2 border border-white opacity-40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationHero;
