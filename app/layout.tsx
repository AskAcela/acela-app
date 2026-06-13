import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  variable: "--font-inter",
  // subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acela",
  description: "Acela - I know everything about Celo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased dark`}
      >
        <body className="h-full bg-base text-text-1 overflow-hidden">
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
