"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from 'next/navigation';
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if the current page is the homepage or login page
  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signUp';

  return (
    <html lang="en">
      <Head>
        <title>Crisis Compass</title>
        <meta name="description" content="Unlimited Online Backup and Cloud Storage" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
<div className="flex flex-col min-h-screen">
          {/* Render Navbar only if it's not the Home or Login page */}
          {!isHomePage && !isLoginPage && !isSignupPage && <Navbar />}
        
        {children}
        
        {/* Render Footer only if it's not the Home page */}
        {!isHomePage && <Footer />}
</div>
      </body>
    </html>
  );
}