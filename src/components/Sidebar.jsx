import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaHome, FaTicketAlt } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

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
        <nav className="flex flex-col gap-4">
          {/* Dashboard Linki */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded ${
                isActive ? "bg-blue-900 font-bold" : "hover:bg-blue-800"
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
              `flex items-center gap-2 p-2 rounded ${
                isActive ? "bg-blue-900 font-bold" : "hover:bg-blue-800"
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
