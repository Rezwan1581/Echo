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
        secondary: "#D1DEE8",
        lightBackground: "#EAF0F5",
        darkText: "#333333",
        lightText: "#A3F6AD",
        accent: "#A2CEF4",
        link: "#4CAF50",
        send: "#53AEE7",
        signin: "#0E3C58",

      },
      focus: ['responsive', 'hover', 'focus']
    },
  },

  plugins: [],
}


