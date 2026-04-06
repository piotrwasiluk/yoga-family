/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#085041",
          light: "#E1F5EE",
          mid: "#1D9E75",
        },
        surface: "#F5F5F0",
        border: "#E5E5E0",
        feeling: {
          great: "#1D9E75",
          good: "#378ADD",
          tough: "#EF9F27",
          sore: "#E24B4A",
        },
      },
    },
  },
  plugins: [],
};
