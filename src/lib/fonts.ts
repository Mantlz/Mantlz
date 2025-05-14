import { Space_Grotesk } from "next/font/google";
import type { NextFont } from 'next/dist/compiled/@next/font';

// Font declarations at module scope - only load the default font initially
const interFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
});

// Lazy load the mono font only when needed
const loadMonoFont = async () => {
  const { Space_Mono } = await import('next/font/google');
  return Space_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
    display: "swap",
    weight: "400",
    preload: true,
    adjustFontFallback: true,
    fallback: ['monospace'],
  });
};

type FontConfig = {
  name: string;
  className: string;
  font: NextFont | null;
  loadFont?: () => Promise<NextFont>;
};

export const FONT_FAMILIES: Record<string, FontConfig> = {
  inter: {
    name: 'Inter',
    className: 'font-sans',
    font: interFont
  },
  system: {
    name: 'System Default',
    className: 'font-sans',
    font: null // Will use system font
  },
  mono: {
    name: 'Monospace',
    className: 'font-mono',
    font: null, // Will be loaded dynamically
    loadFont: loadMonoFont
  }
};

export type FontFamily = keyof typeof FONT_FAMILIES;

export const getFontClass = (fontFamily: FontFamily) => {
  const fontConfig = FONT_FAMILIES[fontFamily];
  return fontConfig?.className ?? 'font-sans';
};

export const getFontVariable = (fontFamily: FontFamily) => {
  const fontConfig = FONT_FAMILIES[fontFamily];
  const font = fontConfig?.font;
  return font && 'variable' in font ? font.variable : '';
}; 