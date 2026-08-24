const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
        },
        secondary: colors.slate,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
        accent: colors.indigo,
        
        // Refined Surface & Background Tokens
        "background-light": "#f8fafc", 
        "background-dark": "#0b0f19", 
        "surface-light": "#ffffff",
        "surface-dark": "#111827",
        "surface-elevated-light": "#ffffff",
        "surface-elevated-dark": "#1e293b",
        "border-light": "#e2e8f0",
        "border-dark": "#1e293b",
        "text-light": "#0f172a",
        "text-dark": "#f8fafc",
        "text-main-light": "#0f172a",
        "text-main-dark": "#f8fafc",
        "text-secondary-light": "#64748b",
        "text-secondary-dark": "#94a3b8",
        "highlight-light": "#eef2ff",
        "highlight-dark": "#1e1b4b",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        'glow-primary': '0 0 25px -4px rgba(79, 70, 229, 0.35)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        DEFAULT: '0.625rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

