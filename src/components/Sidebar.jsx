import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome, FaTicketAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ setSidebarWidth }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (setSidebarWidth) {
      setSidebarWidth(isOpen ? 256 : 64);
    }
  }, [isOpen, setSidebarWidth]);

  return (
    <div className="flex flex-col bg-blue-700 text-white h-screen p-5 transition-all"
      style={{ width: isOpen ? "256px" : "64px" }}
    >
      {/* Menü Aç/Kapat Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white mb-5 text-2xl"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Menü İçeriği */}
      <nav className="flex flex-col gap-2 flex-grow">
        {/* Dashboard Linki */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg w-full transition-all ${
              isActive ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-800"
            }`
          }
        >
          <FaHome />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        {/* Tickets Linki */}
        <NavLink
          to="/dashboard/tickets"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg w-full transition-all ${
              isActive ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-800"
            }`
          }
        >
          <FaTicketAlt />
          {isOpen && <span>Tickets</span>}
        </NavLink>
      </nav>

      {/* Logout Butonu - Sidebar'ın En Altında */}
      <button
        onClick={() => navigate("/")}
        className="mt-auto flex items-center gap-3 p-3 rounded-lg w-full bg-red-600 hover:bg-red-700 transition-all"
      >
        <FaSignOutAlt />
        {isOpen && <span>Logout</span>}
      </button>
    </div>
  );
}
