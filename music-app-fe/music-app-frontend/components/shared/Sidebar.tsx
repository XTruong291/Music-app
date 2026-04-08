"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library } from "lucide-react";

export default function Sidebar() {
  // Dùng usePathname để biết người dùng đang ở trang nào, từ đó bôi sáng menu tương ứng
  const pathname = usePathname();

  const routes = [
    { icon: Home, label: "Trang chủ", href: "/" },
    { icon: Search, label: "Tìm kiếm", href: "/search" },
    { icon: Library, label: "Thư viện", href: "/library" },
  ];

  return (
    <>
      {/* Desktop Sidebar - Cột trái, ẩn trên mobile */}
      <div className="hidden md:flex flex-col w-64 bg-black h-full p-6 text-neutral-400 border-r border-neutral-800">
        <h1 className="text-white font-bold text-2xl mb-8">🎧 Music App</h1>

        <div className="flex flex-col gap-y-4 text-md font-semibold">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-x-4 hover:text-white transition duration-300 ${
                  isActive ? "text-white" : ""
                }`}
              >
                <Icon size={26} />
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation - Ngang dưới, ẩn trên desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black border-t border-neutral-800 px-4 py-3 text-neutral-400 flex justify-around items-center flex-shrink-0 z-50">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex flex-col items-center gap-1 hover:text-white transition duration-300 ${
                isActive ? "text-white" : ""
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
