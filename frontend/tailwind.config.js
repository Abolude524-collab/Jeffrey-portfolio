// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#09090b',
          gradientFrom: '#18181b',
          gradientTo: '#09090b',
        },
        accent: {
          blue: '#3b82f6',
          zinc: '#71717a',
        },
        cardGlass: 'rgba(24, 24, 27, 0.7)',
      },
      borderRadius: {
        glass: '1.25rem',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(59, 130, 246, 0.12)', // Updated to blue shadow
      },
    },
  },
  plugins: [],
};
