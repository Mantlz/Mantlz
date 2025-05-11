import { Space_Grotesk, Space_Mono } from "next/font/google";

// Font declarations at module scope
const interFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
  preload: true,
  adjustFontFallback: true,
  fallback: ['monospace'],
});

export const FONT_FAMILIES = {
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
    font: monoFont
  }
} as const;

export type FontFamily = keyof typeof FONT_FAMILIES;

export const getFontClass = (fontFamily: FontFamily) => {
  return FONT_FAMILIES[fontFamily].className;
};

export const getFontVariable = (fontFamily: FontFamily) => {
  const font = FONT_FAMILIES[fontFamily].font;
  return font ? font.variable : '';
}; 