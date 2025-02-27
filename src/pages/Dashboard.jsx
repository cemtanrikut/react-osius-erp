import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { FaBell, FaEnvelope } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(256); // Başlangıç değeri ayarlandı

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <Sidebar setSidebarWidth={setSidebarWidth} />

      {/* İçerik Alanı */}
      <div className="flex-1 flex flex-col">
        {/* Üst Bar */}
        <header
          className="bg-blue-700 text-white p-4 flex items-center justify-between fixed top-0 w-full z-10"
          style={{ width: `calc(100% - ${sidebarWidth}px)`, left: `${sidebarWidth}px` }}
        >
          {/* Logo */}
          <img src="/osius_logo.png" alt="Osius Logo" className="h-12" />

          {/* Sağ Üst Bildirim ve Mesaj İkonları */}
          <div className="flex items-center gap-4">
            {/* Bildirim Butonu */}
            <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md">
              <FaBell className="text-white text-lg" />
            </button>

            {/* Mesaj Butonu */}
            <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md">
              <FaEnvelope className="text-white text-lg" />
            </button>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 p-6 mt-16 bg-gray-100">
          <Outlet /> {/* Alt sayfalar burada yükleniyor */}
        </main>
      </div>
    </div>
  );
}
