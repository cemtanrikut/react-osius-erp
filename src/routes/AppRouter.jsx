import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import HomePage from "../pages/HomePage";
import Tickets from "../pages/Tickets";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Giriş Sayfası */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout + İçerik Sayfaları */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<h2 className="text-2xl">Ana Sayfa</h2>} />
          <Route path="homepage" element={<HomePage />} />
          <Route path="tickets" element={<Tickets />} />
        </Route>
      </Routes>
    </Router>
  );
}
