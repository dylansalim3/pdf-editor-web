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
          ...colors.blue,
          DEFAULT: "#3b82f6",
          "hover": "#2563eb",
        },
        secondary: colors.slate,
        success: colors.green,
        warning: colors.yellow,
        danger: colors.red,
        
        // Stitch specific colors
        "background-light": "#f3f4f6", 
        "background-dark": "#0f172a", 
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
        "border-light": "#e2e8f0",
        "border-dark": "#334155",
        "text-light": "#1f2937",
        "text-dark": "#e2e8f0",
        "text-main-light": "#111827",
        "text-main-dark": "#F9FAFB",
        "text-secondary-light": "#6B7280",
        "text-secondary-dark": "#9CA3AF",
        "highlight-light": "#EFF6FF",
        "highlight-dark": "#1E3A8A",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
