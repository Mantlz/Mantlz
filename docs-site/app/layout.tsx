import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { StructuredData } from "@/components/structured-data";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
const regularFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-regular",
  display: "swap",
  weight: "400",
});

const codeFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Mantlz Documentation",
    template: "%s | Mantlz Documentation"
  },
  description:
    "Complete documentation for Mantlz - The ultimate form solution platform for building customizable feedback, contact, and waitlist forms with powerful styling options and seamless integrations.",
  keywords: [
    "forms",
    "feedback forms",
    "contact forms",
    "waitlist forms",
    "form builder",
    "react forms",
    "nextjs forms",
    "customizable forms",
    "form styling",
    "form integrations",
    "mantlz",
    "documentation"
  ],
  authors: [{ name: "Mantlz Team" }],
  creator: "Mantlz",
  publisher: "Mantlz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://doc.mantlz.com/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://doc.mantlz.com/",
    title: "Mantlz Documentation",
    description:
      "Complete documentation for Mantlz - The ultimate form solution platform for building customizable feedback, contact, and waitlist forms.",
    siteName: "Mantlz Documentation",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mantlz Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mantlz Documentation",
    description:
      "Complete documentation for Mantlz - The ultimate form solution platform for building customizable forms.",
    images: ["/og-image.png"],
    creator: "@trymantlz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "lTqIuvXz5sq4jT9YOLyja5LLMfvKAiZF3g5fTEa70fI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <body
        className={`${regularFont.variable} ${codeFont.variable} font-regular tracking-wide`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StructuredData />
          <Navbar />
          <main className="sm:container mx-auto w-[88vw] h-auto">
            {children}
            <Analytics />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
