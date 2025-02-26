import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Tickets from "../pages/Tickets";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Giriş Sayfası */}
        <Route path="/" element={<Login />} />

        {/* Dashboard ve Alt Sayfaları */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/tickets" element={<Tickets />} />
        </Route>

        {/* Eğer bilinmeyen bir sayfaya gidilirse Login'e yönlendir */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
