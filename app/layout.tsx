import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://womstv.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Word of Mouth Television",
  description: "The premier streaming network for independent comedy and underground music.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Word of Mouth Television",
    description: "The premier streaming network for independent comedy and underground music.",
    url: siteUrl,
    siteName: "Word of Mouth Television",
    images: [{ url: "/logo.png", width: 1200, height: 1200 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Word of Mouth Television",
    description: "The premier streaming network for independent comedy and underground music.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* 1. Google AdSense Account Verification Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-1205290759053687" />

        <link rel="preconnect" href="https://connecttoyourcity.com" />
        
        {/* 2. Hardcoded HTML script for AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1205290759053687"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body 
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#080A0D", margin: 0, padding: 0 }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}