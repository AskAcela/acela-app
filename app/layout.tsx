import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acela",
  description: "Acela Chat Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="h-full flex bg-zinc-950 text-zinc-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
