/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          300: "#2d3039",
          500: "#1F2127",
          700: "#1E2029",
          800: "#101014",
        },
        neon: "#5e7dab",
        header: "#ccdcfc",
      },
    },
  },
  plugins: [],
};
