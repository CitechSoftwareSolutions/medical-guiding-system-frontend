import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medical Guidance System — Clinical Education & AI Mentorship",
  description:
    "Unified medical education platform for doctors and students with verified learning resources, subscription tiers, and AI clinical tutor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} min-h-screen flex flex-col bg-slate-100/90 text-slate-900 antialiased selection:bg-med-600 selection:text-white relative`}>
        {/* Subtle Ambient Medical Pattern & Depth Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#0e3a64_1px,transparent_1px)] [background-size:24px_24px]" />
        <AuthProvider>
          <SidebarProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
