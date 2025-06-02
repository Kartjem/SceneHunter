/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Apple-specific colors
        apple: {
          blue: "#007AFF",
          purple: "#AF52DE",
          pink: "#FF2D92",
          orange: "#FF9500",
          green: "#30D158",
          red: "#FF3B30",
          yellow: "#FFCC00",
          gray: "#8E8E93",
        },
      },
      backdropBlur: {
        'apple': '20px',
      },
      backgroundImage: {
        'apple-blue': 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
        'apple-purple': 'linear-gradient(135deg, #AF52DE 0%, #FF2D92 100%)',
        'apple-orange': 'linear-gradient(135deg, #FF9500 0%, #FF2D92 100%)',
        'apple-green': 'linear-gradient(135deg, #30D158 0%, #32D74B 100%)',
        'apple-mesh': 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))',
        'apple-mesh-dark': 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.1), rgba(0, 0, 0, 0))',
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    boxShadow: {
      input: "var(--shadow-input)",
    },
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 },
      },
      "fade-in": {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      "fade-in-up": {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      "slide-in-from-top": {
        "0%": { transform: "translateY(-100%)" },
        "100%": { transform: "translateY(0)" },
      },
      "slide-in-from-bottom": {
        "0%": { transform: "translateY(100%)" },
        "100%": { transform: "translateY(0)" },
      },
      "scale-in": {
        "0%": { transform: "scale(0.95)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      "bounce-in": {
        "0%": { transform: "scale(0.3)", opacity: "0" },
        "50%": { transform: "scale(1.05)" },
        "70%": { transform: "scale(0.9)" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      "floating": {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-20px)" },
      },
      "glow": {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.5" },
      },
      "pulse-slow": {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.8" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "fade-in": "fade-in 0.5s ease-out",
      "fade-in-up": "fade-in-up 0.5s ease-out",
      "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
      "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
      "scale-in": "scale-in 0.2s ease-out",
      "bounce-in": "bounce-in 0.6s ease-out",
      "floating": "floating 6s ease-in-out infinite",
      "glow": "glow 2s ease-in-out infinite",
      "pulse-slow": "pulse-slow 3s ease-in-out infinite",
    },
  },
  plugins: [require("tailwindcss-animate")]
}
