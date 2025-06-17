import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./ui/landing-page/header";
import Footer from "./ui/landing-page/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WDD 430 - Handcrafted Haven Group 12",
  description: " A virtual marketplace, connecting talented creators with potential customers",
  authors: [{name: "Sariah Wandler, Shayla Foley, Boluwatife Omotoyinbo, and Ezequiel Rindello"}]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <div>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
