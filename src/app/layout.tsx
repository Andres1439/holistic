import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Holistic - Plataforma Integral de Ecommerce y Social Media",
  description:
    "Potencia tu negocio digital con nuestra plataforma integral. Gestiona tu tienda online, automatiza redes sociales y maximiza tus ventas desde un solo lugar.",
  keywords: ["ecommerce", "social media", "marketing digital", "automatización", "analytics"],
  authors: [{ name: "Holistic Team" }],
  creator: "Holistic",
  publisher: "Holistic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://holistic.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Holistic - Plataforma Integral de Ecommerce y Social Media",
    description:
      "Potencia tu negocio digital con nuestra plataforma integral. Gestiona tu tienda online, automatiza redes sociales y maximiza tus ventas desde un solo lugar.",
    url: "https://holistic.com",
    siteName: "Holistic",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Holistic - Plataforma de Ecommerce",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Holistic - Plataforma Integral de Ecommerce y Social Media",
    description: "Potencia tu negocio digital con nuestra plataforma integral.",
    images: ["/og-image.jpg"],
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
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
