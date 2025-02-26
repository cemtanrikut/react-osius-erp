import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* İçerik Alanı */}
      <div className="flex-1 p-6">
        <header className="bg-blue-600 text-white p-4 text-center text-xl">
          Osius ERP Panel
        </header>
        <main>
          <Outlet /> {/* Buraya değişen sayfa içeriği yüklenecek */}
        </main>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
