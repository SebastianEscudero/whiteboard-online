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
  title: "La pizarra online para colaborar | Sketchlie",
  description: "Sketchlie es una plataforma intuitiva y colaborativa que transforma la manera en que gestionas tus proyectos. Una espacio de trabajo que permite visualizar tus ideas, estructurar sistemas complejos y organizar tu trabajo de manera eficiente",
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
