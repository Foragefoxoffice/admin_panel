/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#35095E',
        secondary: '#51216E',
        text: '#282C35',
      },
    },
  },
  plugins: [],
}
