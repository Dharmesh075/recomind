import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteDescription =
  "An intelligent e-commerce platform with personalized product recommendations powered by AI.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Recomind",
  title: {
    default: "Recomind — Discover products that fit you",
    template: "%s · Recomind",
  },
  description: siteDescription,
  keywords: [
    "personalized recommendations",
    "product discovery",
    "AI recommendations",
    "shopping",
    "recomind",
  ],
  authors: [{ name: "Recomind" }],
  creator: "Recomind",
  openGraph: {
    type: "website",
    siteName: "Recomind",
    title: "Recomind — Discover products that fit you",
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Recomind — Discover products that fit you",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F9F7",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
