import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

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
      <div
        className="flex-1 flex flex-col"
        // style={{ marginLeft: `${sidebarWidth}px` }} // Sidebar genişliği kadar kaydırıyoruz
      >
        {/* Mavi Header */}
        <header
          className="bg-blue-700 text-white p-4 text-center text-xl fixed top-0 w-full z-10"
          style={{ width: `calc(100% - ${sidebarWidth}px)`, left: `${sidebarWidth}px` }}
        >
          <img src="/osius_logo.png" alt="Osius Logo" className="h-12" />
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 p-6 mt-16 bg-gray-100">
          <Outlet /> {/* Alt sayfalar burada yükleniyor */}
        </main>

        {/* Logout Butonu */}
        <button
          onClick={handleLogout}
          className="m-4 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
