import type { Metadata } from "next";
import "./globals.css";
// Supports weights 300-900
import '@fontsource-variable/figtree';


export const metadata: Metadata = {
  title: "LandingLab",
  description: "Tu agente auditor impulsado con Inteligencia Artificial, que te ayudará analizar el sitio web de tu competencia, para que puedas tener el mejor sitio web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
        <link rel="icon" type="image/x-icon" href="/public/LANDINGLAB.png" />
      <body
        className={`antialiased min-h-screen h-full flex items-center justify-center bg-ivory`}
      >
        {children}
      </body>
    </html>
  );
}
