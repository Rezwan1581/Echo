/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {

      colors: {
        //
        primary: "#007BFF",
        secondary: "#FF6B6B",
        lightBackground: "#F5F5F5",
        darkText: "#333333",
        lightText: "#999999",
        accent: "#FFD700",
        link: "#4CAF50",
      },
      focus: ['responsive', 'hover', 'focus']
    },
  },

  plugins: [],
}


