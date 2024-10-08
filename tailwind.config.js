/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customYellow: {
          DEFAULT: '#F9C64E', // Add the custom color here
          hover: '#F9A72E',
        }
      },
    },
  },
  plugins: [],
}

