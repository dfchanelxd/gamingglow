import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "GAMINGGLOW - Download Game & Software PC Legal",
    template: "%s | GAMINGGLOW",
  },
  description: "Portal download game dan software PC yang legal, cepat, dan aman. File terverifikasi dengan checksum & scan antivirus.",
  keywords: ["download game PC", "download software", "game legal", "software legal", "PC games", "PC software"],
  authors: [{ name: "GAMINGGLOW" }],
  creator: "GAMINGGLOW",
  publisher: "GAMINGGLOW",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://gamingglow.id",
    siteName: "GAMINGGLOW",
    title: "GAMINGGLOW - Download Game & Software PC Legal",
    description: "Portal download game dan software PC yang legal, cepat, dan aman.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GAMINGGLOW",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GAMINGGLOW - Download Game & Software PC Legal",
    description: "Portal download game dan software PC yang legal, cepat, dan aman.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-navy-900 text-white">
        {children}
      </body>
    </html>
  );
}
