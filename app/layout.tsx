import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { BookStoreProvider } from "@/components/BookStoreProvider";
import Script from "next/script";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
};

export const metadata: Metadata = {
  title: {
    default: "Is This A Bookclub? | Premium Nigerian Book Club",
    template: "%s | Is This A Bookclub?",
  },
  description: "Experience premium Nigerian literature with 'Is This A Bookclub?'. Join a curated community of readers, explore modern classics, and engage in thoughtful discussions.",
  metadataBase: new URL("https://isthisabookclub.com"),
  keywords: ["Nigerian literature", "book club Nigeria", "premium reading experience", "African writers", "book community"],
  authors: [{ name: "Is This A Bookclub?" }],
  creator: "Is This A Bookclub?",
  publisher: "Is This A Bookclub?",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://isthisabookclub.com",
    siteName: "Is This A Bookclub?",
    title: "Is This A Bookclub? | Premium Nigerian Book Club",
    description: "Curated Nigerian literature and premium reading experiences.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Is This A Bookclub? Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is This A Bookclub? | Premium Nigerian Book Club",
    description: "Curated Nigerian literature and premium reading experiences.",
    images: ["/logo.png"],
    creator: "@isthisabookclub",
  },
  manifest: "/manifest.json",
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
    google: "google7c7c9a461857b557",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${montserrat.variable} font-sans antialiased bg-background text-foreground`}
      >
        <BookStoreProvider>
          {children}
        </BookStoreProvider>
        <Toaster position="bottom-right" />
        
        {/* Organization Schema for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "https://isthisabookclub.com",
              "logo": "https://isthisabookclub.com/logo.png",
              "name": "Is This A Bookclub?",
              "sameAs": [
                "https://www.instagram.com/isthisabookclubhq"
              ]
            }),
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
                console.log("ITABC Analytics Initialized");
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
