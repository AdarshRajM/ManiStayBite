export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal
          600: '#0d9488',
          900: '#134e4a',
        },
        dark: {
          bg: '#0f172a', // Slate 900
          card: '#1e293b', // Slate 800
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
