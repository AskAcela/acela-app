import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/context/NotificationContext";
import TelegramBanner from "@/components/TelegramBanner";

const inter = Inter({
  variable: "--font-inter",
  // subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://askacela.xyz"),
  title: {
    default: "Acela – Your AI Expert on Celo",
    template: "%s | Acela",
  },
  description:
    "Acela is an AI assistant that knows everything about the Celo blockchain. Ask questions, explore ideas, and pitch your startup — all in one place.",
  keywords: [
    "Celo",
    "Celo blockchain",
    "Celo AI",
    "blockchain assistant",
    "Celo DeFi",
    "crypto AI",
    "Acela",
  ],
  authors: [{ name: "Acela" }],
  creator: "Acela",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://askacela.xyz",
    siteName: "Acela",
    title: "Acela – Your AI Expert on Celo",
    description:
      "Ask anything about the Celo blockchain. Acela is an AI assistant built to answer your questions, challenge your ideas, and help you build on Celo.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Acela – AI expert on Celo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acela – Your AI Expert on Celo",
    description:
      "Ask anything about the Celo blockchain. Acela is an AI assistant built to answer your questions, challenge your ideas, and help you build on Celo.",
    images: ["/image.png"],
  },
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
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.png",
  },
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
        <body className="flex h-full flex-col bg-base text-text-1 overflow-hidden">
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-3QE3470331"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3QE3470331');
            `}
          </Script>
          <NotificationProvider>
            <TelegramBanner />
            <div className="min-h-0 flex-1">{children}</div>
          </NotificationProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
