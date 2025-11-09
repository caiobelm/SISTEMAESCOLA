import type { Config } from 'tailwindcss';
import { brandTheme } from '@sistemaescola/ui';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: brandTheme.colors.primary,
        secondary: brandTheme.colors.secondary,
        accent: brandTheme.colors.accent
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
