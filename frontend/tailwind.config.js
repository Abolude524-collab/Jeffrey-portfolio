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
          DEFAULT: '#231a15',
          gradientFrom: '#2d2017',
          gradientTo: '#1a120d',
        },
        accent: {
          emerald: '#10b981',
          slate: '#64748b',
        },
        cardGlass: 'rgba(36, 28, 22, 0.7)',
      },
      borderRadius: {
        glass: '1.25rem',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(16, 185, 129, 0.12)',
      },
    },
  },
  plugins: [],
};
