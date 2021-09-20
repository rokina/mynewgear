module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: {
        light: "#333333",
        DEFAULT: "#2b2b2b",
        dark: "#1a1a1a",
      },
      white: {
        DEFAULT: "#ffffff",
      },
      gray: {
        DEFAULT: "#666666",
      },
      red: {
        DEFAULT: "#f26a8d",
      },
      blue: {
        DEFAULT: "#28C2FF",
      },
      green: {
        DEFAULT: "#60c5ba",
      },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
