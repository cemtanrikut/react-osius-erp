import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Tickets from "../pages/Tickets";
import List from "../pages/List";
import Customers from "../pages/Customers";
import Buildings from "../pages/Buildings";
import Workers from "../pages/Workers";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Login Sayfası */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout + İçerik Sayfaları */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="list" element={<List />} />
          <Route path="customers" element={<Customers />} />
          <Route path="buildings" element={<Buildings />} />
          <Route path="workers" element={<Workers />} />
        </Route>

        {/* Bilinmeyen sayfalarda Login'e yönlendir */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
