import type { Metadata } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { BookStoreProvider } from "@/components/BookStoreProvider";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Is This A Bookclub?",
  description: "A premium book club experience featuring Nigerian literature.",
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
      </body>
    </html>
  );
}
