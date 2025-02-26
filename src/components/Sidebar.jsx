import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaHome, FaUser, FaCog } from "react-icons/fa";

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
          <div className="hover:bg-blue-800 p-2 rounded">
            <Link to="/dashboard" className="flex items-center gap-2">
              <FaHome />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </div>
          <div className="hover:bg-blue-800 p-2 rounded">
            <Link to="/dashboard/homepage" className="flex items-center gap-2">
              <FaUser />
              {isOpen && <span>Home</span>}
            </Link>
          </div>
          <div className="hover:bg-blue-800 p-2 rounded">
            <Link to="/dashboard/tickets" className="flex items-center gap-2">
              <FaCog />
              {isOpen && <span>Tickets</span>}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
