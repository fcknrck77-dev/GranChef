import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import Footer from "@/components/Footer";
import SecurityLayer from "@/components/SecurityLayer";
import GlobalAuthGuard from "@/components/GlobalAuthGuard";
import { TrialBlockedModal } from "@/components/TrialBlockedModal";
import HelpChat from "@/components/HelpChat";

export const metadata: Metadata = {
  title: "GrandChef Lab | Intelligence & Gastronomy",
  description: "The official corporate infrastructure for culinary intelligence and research.",
  icons: {
    icon: "/logo_premium.png",
    apple: "/logo_premium.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SecurityLayer />
        <AdminAuthProvider>
          <UserAuthProvider>
            <GlobalAuthGuard />
            <TrialBlockedModal />
            <HelpChat />
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </UserAuthProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
