import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";

import { Toaster } from "@/components/ui/sonner"
import { ModalProvider } from "@/providers/modal-provider";
import { Suspense } from "react";
import { Loading } from "@/components/auth/loading";
import { ProModalProvider } from "@/providers/max-layers-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sketchlie.com"),
  title: "El Espacio de Trabajo para Colaborar | Sketchlie",
  description: "Sketchlie es una plataforma intuitiva y colaborativa que transforma la manera en que gestionas tus proyectos. Una espacio de trabajo que permite visualizar tus ideas, estructurar sistemas complejos y organizar tu trabajo de manera eficiente",
  keywords: ["sketchlie", "sketch", "collaboration", "workspace", "design", "ui", "ux", "prototyping", "wireframes", "mockups", "design system", "design tool", "design collaboration", "design collaboration tool", "design collaboration platform", "design collaboration software", "design collaboration app", "design collaboration website", "design collaboration web app", "design collaboration web platform", "design collaboration web software", "design collaboration web tool", "design collaboration web site", "design collaboration web application", "design collaboration web page", "design collaboration web service", "design collaboration web solution", "design collaboration web utility", "design collaboration web product", "design collaboration web system"],
  alternates: {
    canonical: "https://www.sketchlie.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <ConvexClientProvider>
            <Toaster />
            <ProModalProvider />
            <ModalProvider />
            {children}
          </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
