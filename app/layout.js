import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pertamina Internship Finder 2026",
  description: "Platform modern visualisasi data lowongan magang PT Pertamina (Persero) 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark h-full antialiased selection:bg-pink-500 selection:text-white">
      {/* 💡 DIUBAH: Menggunakan text-white dan bg-[#0d0614] solid agar kontrasnya keluar tajam */}
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-[#0d0614] font-sans text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}