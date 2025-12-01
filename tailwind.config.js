import { tailwindColors } from './src/constants/colors.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Montana State Club Soccer colors - synced with MSCSS library
        ...tailwindColors,
      }
    },
  },
  plugins: [],
}
