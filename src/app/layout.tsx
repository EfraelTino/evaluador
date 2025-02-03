import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'

import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LandingLab",
  description:
    "Tu agente auditor impulsado con Inteligencia Artificial, que te ayudará analizar el sitio web de tu competencia, para que puedas tener el mejor sitio web.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/LANDINGLAB.png" />
      </head>
      <body
        className={`${inter.className} ${'antialiased min-h-screen  bg-ivory'}`}
      >
        {children}
        <Toaster
        
        />
      </body>
    </html>
  );
}
