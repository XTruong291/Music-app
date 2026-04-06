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
        {/* Vùng chứa toàn bộ ứng dụng: Cao bằng màn hình (h-screen) */}
        <div className="flex h-screen overflow-hidden">
          {/* Thanh Menu bên trái */}
          <Sidebar />

          {/* Khu vực nội dung chính thay đổi theo trang */}
          <main className="flex-1 overflow-y-auto bg-neutral-900 md:rounded-lg m-2 mb-24 md:mb-2 md:mr-2">
            {children}
          </main>
        </div>

        {/* Khung giữ chỗ cho Thanh phát nhạc (Player) - Cố định dưới đáy */}
        <div className="fixed bottom-0 left-0 w-full h-24 bg-neutral-800/95 backdrop-blur-md border-t border-neutral-700 flex items-center justify-center z-50">
          <MusicPlayer/>
        </div>
      </body>
    </html>
  );
}
