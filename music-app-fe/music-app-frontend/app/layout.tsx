// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar"; // Import Sidebar vừa tạo
import MusicPlayer from "@/components/shared/MusicPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music App",
  description: "Nghe nhạc thả ga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Mobile-first: flex-col | Desktop: flex-row */}
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
          {/* Sidebar (Adaptive: Desktop bên trái, Mobile ẩn + Bottom Nav) */}
          <Sidebar />

          {/* Main container: Content + Player */}
          <div className="flex-1 flex flex-col overflow-hidden pb-44 md:pb-0">
            {/* Content chính */}
            <main className="flex-1 overflow-y-auto bg-neutral-900 p-4 md:rounded-lg md:m-2 md:mr-2">
              {children}
            </main>

            {/* Music Player - luôn hiển thị phía trên bottom nav */}
            <div className="fixed md:static bottom-20 md:bottom-auto left-0 md:left-auto right-0 md:right-auto h-24 w-full md:w-auto bg-neutral-800/95 backdrop-blur-md border-t border-neutral-700 flex items-center justify-center flex-shrink-0 z-40">
              <MusicPlayer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
