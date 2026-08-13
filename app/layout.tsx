import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono, Hanken_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", weight: ["400", "500", "600", "700"] });
// Author (Fontshare) — display face for titles and the logo, self-hosted
const author = localFont({
  src: [
    { path: "./fonts/Author-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Author-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Author-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Author-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-author",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
const siteName = "EDTR+"
const siteTitle = "EDTR+ — Online Notepad++ alternative for Quick Notes"
const siteDescription = "An online Notepad++ alternative for quick notes."

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  generator: "YMG.DIGITAL",
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/placeholder.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${hanken.variable} ${author.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors />
        <Analytics />
        <Script
          defer
          src="https://umami.ymg.digital/script.js"
          data-website-id="760f938a-09c8-4d87-b21e-d51c36c7fe50"
        />
      </body>
    </html>
  )
}
