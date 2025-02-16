/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F6F6F6",
        secondary: "#F15C54",
        textopacity: "#FFFFFF70",
        dark: "#0a142f",
        mainGray: "#4B5563",
      },
      container: {
        center: true,
        padding: "1rem",
      },
      screens: {
        xs: "350px",
        ss:"500px",
        md: "768px",
        xl: "1280px",
      },
      width: {
        "custom-md": "calc(100% - 124px)",
        "custom-xl": "80%",
      },
      rotate: {
        "-90": "-90deg",
        90: "90deg",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
