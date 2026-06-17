import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/context/NotificationContext";

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
        <head>
          <meta name="talentapp:project_verification" content="3902d5be684ff801a5e5bb9ca5a2a62ce67c5ddec2b8b97c582e24c776885df57034707203d778857f16b3bb0fd921fc1e5bb08c9f93f2d9f34448aad76a3771" />
        </head>
        <body className="h-full bg-base text-text-1 overflow-hidden">
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
