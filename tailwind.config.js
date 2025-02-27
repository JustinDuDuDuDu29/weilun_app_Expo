/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit',
  // darkMode: "class",
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./page/*.{js,jsx,ts,tsx}", "./App.tsx", "./components/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

