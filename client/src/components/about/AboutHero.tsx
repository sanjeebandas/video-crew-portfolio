const AboutHero = () => {
  return (
    <section className="w-full bg-black text-white py-12 md:py-20">

      <div className="max-w-[1248px] mx-auto px-0 sm:px-6 md:px-0">
        {/* Flex container to handle centering on mobile */}
        <div className="flex justify-center md:justify-start">
          {/* Portrait Card */}
          <div className="relative aspect-[3/4] w-[302px] md:w-full md:aspect-auto rounded-xs overflow-hidden">
            {/* Banner Image */}
            <img
              src="/imgs/about/Frame.webp"
              alt="Video Crew Banner"
              className="w-full h-full object-cover rounded-xs"
            />

            {/* Text overlay */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 md:right-auto">
              <div>
                <div>
                  <h3 className="text-sm md:text-lg font-semibold">회사소개</h3>
                  <p className="text-sm md:text-sm leading-snug mt-1">
                    <span className="font-semibold">Video Crew,</span>
                    <br />
                    <span className="font-medium opacity-75">
                      Video Consulting Firm
                    </span>
                  </p>
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="flex space-x-2 mt-4 md:mt-6">
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
      </div>
    </section>
  );
};

export default AboutHero;
