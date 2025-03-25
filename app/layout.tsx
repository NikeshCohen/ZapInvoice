// NEEDS TO BE IMPORTED FIRST, it will auto move to top on save based on .prettierrc
import { ReactScan } from "@/components/global/ReactScan";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/app/_styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

import Background from "@/components/global/Background";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import Toaster from "@/components/global/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ZapInvoice - Invoicing Made Simple",
    absolute: "ZapInvoice - Invoicing Made Simple",
  },
  description:
    "ZapInvoice is a fast, user-friendly invoicing platform. Generate, format, and manage invoices effortlessly with smart automation and no unnecessary complexity.",
  keywords: [
    "AI Invoicing",
    "Invoice Generator",
    "Automated Billing",
    "ZapInvoice",
    "Fast Invoicing",
    "Business Finance",
    "Invoice Management",
  ],
  icons: [{ rel: "icon", url: "/icon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <ReactScan />
      <body
        className={`${geistSans.variable} ${geistMono.variable} theme-transition antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Background />
          <Toaster />
          <Analytics />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
