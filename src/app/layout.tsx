import type { Metadata } from "next";
import "./globals.css";
// Supports weights 300-900
import '@fontsource-variable/figtree';

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/LANDINGLAB.png" />
      </head>
      <body
        className="antialiased min-h-screen flex items-center justify-center bg-ivory"
      >
        {children}
      </body>
    </html>
  );
}
