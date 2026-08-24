import type { Metadata } from "next";

import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";


export const metadata: Metadata = {
  title: "SmartScreen",
  description: "AI-powered resume screening platform",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body className="bg-zinc-950 text-white">

        <Sidebar />

        <Navbar />

        <main className="ml-64 min-h-screen pt-16">

          {children}

        </main>

      </body>

    </html>
  );
}