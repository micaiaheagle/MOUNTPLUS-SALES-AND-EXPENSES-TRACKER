import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TARAND Intelligent ERP",
  description: "Autonomous, AI-First Enterprise System",
  manifest: "/manifest.json",
};

import { Header } from "@/components/Header";

// ... (imports remain)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#eceef1]`}>
        <Header />
        <div className="flex min-h-screen pt-14">
          <Sidebar />
          <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-3.5rem)]">
            <Providers>
              {children}
            </Providers>
          </main>
        </div>
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
