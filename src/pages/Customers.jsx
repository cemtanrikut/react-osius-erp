import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaPlus, FaEye, FaTimes, FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function Customers() {
    const navigate = useNavigate(); // 🚀 Yönlendirme için
    const [customers, setCustomers] = useState([]); // Fake datayı kaldırdık
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [statusFilter, setStatusFilter] = useState("Active");
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 13;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Hata state'i ekledik

    // 📌 **Backend'den Veriyi Çekme**
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const API_URL = window.location.hostname === "localhost"
                    ? "http://localhost:8080"
                    : "https://api-osius.up.railway.app";

                const response = await fetch(`https://api-osius.up.railway.app/customers`); // URL string içinden düzeltilerek çıkarıldı
                if (!response.ok) throw new Error("Failed to fetch customers");

                const data = await response.json();
                setCustomers(data);
                setFilteredCustomers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customers:", error);
                setError("Failed to load customers.");
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // 🔍 **Filtreleme Fonksiyonu**
    useEffect(() => {
        let filtered = customers.filter((customer) =>
            (searchName ? customer.name.toLowerCase().includes(searchName.toLowerCase()) : true) &&
            (searchEmail ? customer.email.toLowerCase().includes(searchEmail.toLowerCase()) : true) &&
            (statusFilter ? customer.status === statusFilter : true)
        );

        setFilteredCustomers(filtered);
    }, [searchName, searchEmail, statusFilter, customers]);

    // Filtreleri temizleme
    const clearFilters = () => {
        setSearchName("");
        setSearchEmail("");
        setStatusFilter("Active");
    };

    // **Pagination hesaplama**
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = (filteredCustomers || []).slice(indexOfFirstCustomer, indexOfLastCustomer);

    return (
        <div className="p-6">
            <Toaster /> {/* 🚀 **Toast Mesajlarını Gösterir** */}
            <h1 className="text-2xl font-bold mb-6">Customers</h1>

            {/* **Eğer hata varsa göster** */}
            {error && <p className="text-red-500">{error}</p>}

            {/* **Eğer yükleniyorsa "Loading..." göster** */}
            {loading && <p className="text-gray-500">Loading...</p>}

            {/* Eğer hata yoksa ve yüklenme tamamlandıysa tabloyu göster */}
            {!loading && !error && (
                <>
                    {/* 🎯 Filtreleme Alanı */}
                    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center gap-4">
                        <FaFilter className="text-gray-600" />
                        <input
                            type="text"
                            placeholder="Search by Name"
                            className="border px-3 py-2 rounded-lg"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Search by Email"
                            className="border px-3 py-2 rounded-lg"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <select
                            className="border px-3 py-2 rounded-lg"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Filter by Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <button className="bg-gray-500 text-white px-3 py-2 rounded-lg" onClick={clearFilters}>
                            Clear
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 ml-auto flex items-center"
                            onClick={() => navigate("/dashboard/customers/add")}>
                            <FaPlus className="mr-2" />
                            Add Customer
                        </button>
                    </div>

                    {/* 🎯 Müşteri Listesi */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr className="text-left">
                                    <th className="p-3 border-b">ID</th>
                                    <th className="p-3 border-b">Name</th>
                                    <th className="p-3 border-b">Phone</th>
                                    <th className="p-3 border-b">Email</th>
                                    <th className="p-3 border-b">Status</th>
                                    <th className="p-3 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/dashboard/customers/${customer.id}`, { state: { customer } })}
                                    >
                                        <td className="p-3 border-b">{customer.id}</td>
                                        <td className="p-3 border-b">{customer.name}</td>
                                        <td className="p-3 border-b">{customer.phone}</td>
                                        <td className="p-3 border-b">{customer.email}</td>
                                        <td className="p-3 border-b">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${customer.status === "Active"
                                                ? "bg-green-300 text-green-800"
                                                : customer.status === "Inactive"
                                                    ? "bg-red-300 text-red-800"
                                                    : "bg-yellow-300 text-yellow-800"
                                                }`}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="p-3 border-b">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/customers/${customer.id}`, { state: { customer } });
                                                }}
                                            >
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    

                    {/* 🎯 Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-gray-600">
                            Showing {filteredCustomers.length > 0 ? indexOfFirstCustomer + 1 : 0}-
                            {filteredCustomers.length > 0 ? Math.min(indexOfLastCustomer, filteredCustomers.length) : 0}
                            of {filteredCustomers.length || 0} customers
                        </p>

                        <div className="flex gap-2">
                            <button
                                className={`px-3 py-1 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Prev
                            </button>

                            <button
                                className={`px-3 py-1 rounded-lg ${currentPage >= Math.ceil(filteredCustomers.length / customersPerPage) ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                disabled={currentPage >= Math.ceil(filteredCustomers.length / customersPerPage)}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
