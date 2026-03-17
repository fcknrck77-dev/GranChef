import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import Footer from "@/components/Footer";
import SecurityLayer from "@/components/SecurityLayer";
import GlobalAuthGuard from "@/components/GlobalAuthGuard";

export const metadata: Metadata = {
  title: "GrandChef Lab - Omniscience",
  description: "The ultimate culinary experimentation laboratory",
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
