import React from "react";

const BlobBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top-left Blob */}
      <img
        src="/imgs/Pattern.webp"
        alt="Top Left Blob"
        className="absolute top-[-2px] left-[-60px] w-[280px] md:w-[400px] opacity-20"
      />

      {/* Bottom-right Blob */}
      <img
        src="/imgs/Pattern.webp"
        alt="Bottom Right Blob"
        className="absolute bottom-[-100px] right-[-100px] w-[300px] md:w-[450px] opacity-30"
      />
    </div>
  );
};

export default BlobBackground;
