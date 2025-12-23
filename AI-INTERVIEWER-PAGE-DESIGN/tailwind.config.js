/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Google branding from Paulie Scanlon's Tailwind post
        'google-button-blue': '#4285F4',
        'google-button-blue-hover': '#3367D6',
        'google-logo-blue': '#4285F4',
        'google-logo-green': '#34A853',
        'google-logo-yellow': '#FBBC05',
        'google-logo-red': '#EA4335',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
