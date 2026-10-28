import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "motori — sua próxima história começa aqui",
  description:
    "Veículos selecionados, acessórios e guias para você fazer a escolha certa e aproveitar cada caminho.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
