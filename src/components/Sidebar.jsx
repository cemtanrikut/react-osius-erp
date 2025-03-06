import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome, FaTicketAlt, FaSignOutAlt, FaUserCircle, FaUsers, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ setSidebarWidth }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const user = { name: "Cem Tanrikut" };

  useEffect(() => {
    if (setSidebarWidth) {
      setSidebarWidth(isOpen ? 256 : 64);
    }
  }, [isOpen, setSidebarWidth]);

  return (
    <div
      className="flex flex-col bg-blue-700 text-white h-screen p-5 transition-all duration-300 relative"
      style={{ width: isOpen ? "256px" : "64px" }}
    >
      {/* Menü Aç/Kapat Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white mb-5 text-2xl flex items-center"
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
            `relative flex items-center p-3 rounded-lg w-full transition-all ${
              isActive ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-800"
            }`
          }
        >
          <FaHome className="text-xl absolute left-3 transform -translate-y-1/2" />
          <span
            className={`transition-all duration-300 ${isOpen ? "ml-10 opacity-100" : "opacity-0"}`}
          >
            Dashboard
          </span>
        </NavLink>

        {/* Tickets Linki */}
        {/* <NavLink
          to="/dashboard/tickets"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg w-full transition-all ${
              isActive ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-800"
            }`
          }
        >
          <FaTicketAlt className="text-xl left-3 absolute transform -translate-y-1/2" />
          <span
            className={`transition-all duration-300 ${isOpen ? "ml-10 opacity-100" : "opacity-0"}`}
          >
            Tickets
          </span>
        </NavLink> */}

        {/* List Linki */}
        <NavLink
            to="/dashboard/list"
            className={({ isActive }) =>
                `relative flex items-center p-3 rounded-lg w-full transition-all ${
                isActive ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-800"
                }`
            }
        >
          <FaTicketAlt className="text-xl left-3 absolute transform -translate-y-1/2" />
          <span
            className={`transition-all duration-300 ${isOpen ? "ml-10 opacity-100" : "opacity-0"}`}
          >
            Tickets
          </span>
        </NavLink>

        {/* ✅ Customers Linki */}
        <NavLink
          to="/dashboard/customers"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg w-full transition-all ${
              isActive ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-800"
            }`
          }
        >
          <FaUsers className="text-xl left-3 absolute transform -translate-y-1/2" />
          <span
            className={`transition-all duration-300 ${isOpen ? "ml-10 opacity-100" : "opacity-0"}`}
          >
            Customers
          </span>
        </NavLink>

        {/* ✅ Buildings Linki */}
        <NavLink
          to="/dashboard/buildings"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg w-full transition-all ${
              isActive ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-800"
            }`
          }
        >
          <FaBuilding className="text-xl left-3 absolute transform -translate-y-1/2" />
          <span
            className={`transition-all duration-300 ${isOpen ? "ml-10 opacity-100" : "opacity-0"}`}
          >
            Buildings
          </span>
        </NavLink>

      </nav>

      {/* Kullanıcı Bilgisi - Logout'un Üstünde */}
      <div className="mb-4">
        <button
          className="relative flex items-center p-3 rounded-lg w-full bg-blue-800 hover:bg-blue-500 transition-all"
        >
          <FaUserCircle className="text-xl absolute left-3 transform -translate-y-1/2" />
          <span
            className={`transition-all duration-300 ${isOpen ? "ml-10 opacity-100" : "opacity-0"}`}
          >
            {user.name}
          </span>
        </button>
      </div>

      {/* Logout Butonu - Sidebar'ın En Altında */}
      <button
        onClick={() => navigate("/")}
        className="relative flex items-center p-3 rounded-lg w-full bg-red-600 hover:bg-red-700 transition-all mt-auto"
      >
        <FaSignOutAlt className="text-xl absolute left-3 transform -translate-y-1/2" />
        <span
          className={`transition-all duration-300 ${isOpen ? "ml-10 opacity-100" : "opacity-0"}`}
        >
          Logout
        </span>
      </button>
    </div>
  );
}
