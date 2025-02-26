import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome, FaTicketAlt } from "react-icons/fa";

export default function Sidebar({ setSidebarWidth }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (setSidebarWidth) {
      setSidebarWidth(isOpen ? 256 : 64);
    }
  }, [isOpen, setSidebarWidth]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-blue-700 text-white h-screen p-5 transition-all ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Menü Aç/Kapat Butonu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white mb-5 text-2xl"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menü İçeriği */}
        <nav className="flex flex-col gap-2">
          {/* Dashboard Linki */}
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg w-full transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-bold"
                  : "hover:bg-blue-800"
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
                isActive
                  ? "bg-blue-600 text-white font-bold"
                  : "hover:bg-blue-800"
              }`
            }
          >
            <FaTicketAlt />
            {isOpen && <span>Tickets</span>}
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
