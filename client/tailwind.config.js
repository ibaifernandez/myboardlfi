/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base palette — dark slate theme
        surface: {
          0: '#0f1117',   // app background
          1: '#16181f',   // sidebar
          2: '#1e2028',   // column bg
          3: '#252830',   // card bg
          4: '#2e3140',   // hover / elevated
        },
        border: {
          DEFAULT: '#2e3140',
          strong:  '#3d4155',
        },
        text: {
          primary:   '#e8eaf0',
          secondary: '#8b90a0',
          muted:     '#555b70',
        },
        accent: '#6366f1',  // indigo-500
      },
      // Priority colours
      priority: {
        low:    '#22c55e',
        medium: '#f59e0b',
        high:   '#ef4444',
        urgent: '#a855f7',
      },
    },
  },
  plugins: [],
};
