import type { Config } from 'tailwindcss';

/**
 * Public-website design tokens. Colors are HSL CSS variables (see globals.css) —
 * the same semantic tokens used by the admin app, so the two surfaces stay
 * visually consistent. Never hardcode hex values in components; consume tokens.
 * Dark mode uses class strategy: 'dark' class on <html> toggles the dark palette.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      screens: {
        /* Primary nav + larger text only fit comfortably from 1600px up (see
           desktop-nav.tsx / mobile-nav.tsx) — below that the header collapses
           to the hamburger menu instead of clipping. */
        nav: '1600px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          foreground: 'hsl(var(--surface-foreground))',
          alt: 'hsl(var(--surface-alt))',
          'alt-foreground': 'hsl(var(--surface-alt-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          action: 'hsl(var(--accent-action))',
          'action-foreground': 'hsl(var(--accent-action-foreground))',
        },
        heading: {
          DEFAULT: 'hsl(var(--heading))',
          foreground: 'hsl(var(--heading-foreground))',
        },
        hero: {
          DEFAULT: 'hsl(var(--hero))',
          foreground: 'hsl(var(--hero-foreground))',
          muted: 'hsl(var(--hero-muted))',
        },
        link: 'hsl(var(--link))',
        footer: {
          DEFAULT: 'hsl(var(--footer))',
          foreground: 'hsl(var(--footer-foreground))',
        },
        olive: {
          DEFAULT: 'hsl(var(--olive))',
          foreground: 'hsl(var(--olive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        hindi: ['var(--font-hindi)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'var(--font-serif-hindi)', 'Georgia', 'serif'],
        'serif-hindi': ['var(--font-serif-hindi)', 'var(--font-hindi)', 'Georgia', 'serif'],
      },
      maxWidth: {
        container: '80rem',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'slide-in-right': 'slide-in-right 200ms ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
