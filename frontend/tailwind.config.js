/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#F1F1F1",
        bg_primary: "#050816",
        "black-100": "#5F6F77",
        "black-200": "#D9D9D9",
      },
      boxShadow: {
        card: "4px 4px 4px 1px rgba(0, 0, 0, 0.25)",
      },
      screens: {
        xs: "450px",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
      backgroundImage: {
        "custom-background": "url('/images/background.jpg')",
      },
      boxShadow: {
        "custom-pink": "0px 0px 20px 0px rgba(223, 87, 234, 1)",
        "custom-pink-rb": "5px 5px 20px 0px rgba(223, 87, 234, 1)",
      },
    },
  },
  plugins: [],
}

