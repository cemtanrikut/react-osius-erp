import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Tickets from "../pages/Tickets";
import List from "../pages/List";
import Customers from "../pages/Customers";
import Buildings from "../pages/Buildings";
import Workers from "../pages/Workers";
import CustomerDetail from "../pages/CustomerDetail";
import BuildingDetail from "../pages/BuildingDetail";
import WorkerDetail from "../pages/WorkerDetail";
import WorkerAdd from "../pages/WorkerAdd";
import BuildingAdd from "../pages/BuildingAdd";
import CustomerAdd from "../pages/CustomerAdd";
import ListAdd from "../pages/ListAdd";


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
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="buildings/:id" element={<BuildingDetail />} />
          <Route path="workers/:id" element={<WorkerDetail />} />
          <Route path="workers/add" element={<WorkerAdd />} />
          <Route path="buildings/add" element={<BuildingAdd />} />
          <Route path="customers/add" element={<CustomerAdd />} />
          <Route path="list/add" element={<ListAdd />} />
        </Route>

        {/* Bilinmeyen sayfalarda Login'e yönlendir */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
