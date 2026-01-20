/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['"Montserrat"', "sans-serif"],
        suit: ['"SUIT"', "sans-serif"],
      },
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",    // Large desktop / ultra-wide threshold
        "4xl": "2560px",    // Super ultra-wide (32:9, etc.)
      },
      maxWidth: {
        'content': '1248px',      // Default content rail
        'content-lg': '1400px',   // Expanded for larger screens
        'content-xl': '1600px',   // For ultra-wide displays
        'content-2xl': '1800px',  // Maximum content width
      },
    },
  },
  plugins: [],
};
