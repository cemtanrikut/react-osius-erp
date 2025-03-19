import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaFilter, FaPlus, FaEye, FaTimes, FaUserCircle, FaPhone,
    FaEnvelope, FaCheckCircle, FaArrowLeft, FaArrowRight, FaEdit
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function Workers() {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [searchName, setSearchName] = useState("");
    const [statusFilter, setStatusFilter] = useState("Active");
    const [currentPage, setCurrentPage] = useState(1);
    const workersPerPage = 10;
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 📌 **Backend'den Worker'ları Çekme**
    useEffect(() => {
        const fetchWorkers = async () => {
            setIsLoading(true);
            try {
                const API_URL = window.location.hostname === "localhost"
                    ? "http://localhost:8080"
                    : "https://api-osius.up.railway.app";

                const response = await fetch(`https://api-osius.up.railway.app/workers`);
                if (!response.ok) {
                    throw new Error("Failed to fetch workers");
                }
                const data = await response.json();
                setWorkers(data);
                setFilteredWorkers(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching workers:", error);
                toast.error("Error fetching workers!", { position: "top-right" });
                setError("Failed to load workers.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkers();
    }, []);

    // ✅ **Filtreleme Fonksiyonu**
    useEffect(() => {
        const filtered = workers.filter((worker) =>
            (searchId ? worker.id.toLowerCase().includes(searchId.toLowerCase()) : true) &&
            (searchName ? worker.name.toLowerCase().includes(searchName.toLowerCase()) : true) &&
            (statusFilter ? worker.status === statusFilter : true)
        );
        setFilteredWorkers(filtered);
        setCurrentPage(1);
    }, [searchId, searchName, statusFilter, workers]);

    // Filtreleri Temizleme
    const clearFilters = () => {
        setSearchId("");
        setSearchName("");
        setStatusFilter("Active");
        setFilteredWorkers(workers);
        setCurrentPage(1);
    };

    // ✅ **Pagination hesaplama (HATA ÖNLEMELİ)**
    const indexOfLastWorker = currentPage * workersPerPage;
    const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
    const currentWorkers = (filteredWorkers || []).slice(indexOfFirstWorker, indexOfLastWorker);

    return (
        <div className="p-6">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6">Workers</h1>

            {/* 🎯 **Filtreleme Alanı** */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center gap-4">
                <FaFilter className="text-gray-600" />
                <input
                    type="text"
                    placeholder="Search by ID"
                    className="border px-3 py-2 rounded-lg"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Name"
                    className="border px-3 py-2 rounded-lg"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <select
                    className="border px-3 py-2 rounded-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Filter by Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                </select>
                <button className="bg-gray-500 text-white px-3 py-2 rounded-lg" onClick={clearFilters}>
                    Clear
                </button>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 ml-auto flex items-center"
                    onClick={() => navigate("/dashboard/workers/add")}
                >
                    <FaPlus className="mr-2" />
                    Add Worker
                </button>
            </div>

            {/* 📌 **Veri yüklenirken veya hata alındığında** */}
            {isLoading ? (
                <p className="text-center text-gray-600">Loading workers...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (
                <>
                    {/* 🎯 **Worker Listesi** */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr className="text-left">
                                    <th className="p-3 border-b">ID</th> {/* ✅ ID sütunu eklendi */}
                                    <th className="p-3 border-b">Name</th>
                                    <th className="p-3 border-b">Phone</th>
                                    <th className="p-3 border-b">Email</th>
                                    <th className="p-3 border-b">Status</th>
                                    <th className="p-3 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentWorkers.map((worker) => (
                                    <tr
                                        key={worker.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/dashboard/workers/${worker.id}`, { state: { worker } })}
                                    >
                                        <td className="p-3 border-b">{worker.id}</td> {/* ✅ ID gösteriliyor */}
                                        <td className="p-3 border-b">{worker.name}</td>
                                        <td className="p-3 border-b">{worker.phone}</td>
                                        <td className="p-3 border-b">{worker.email}</td>
                                        <td className="p-3 border-b">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${worker.status === "Active"
                                                ? "bg-green-300 text-green-800"
                                                : worker.status === "Inactive"
                                                    ? "bg-red-300 text-red-800"
                                                    : "bg-yellow-300 text-yellow-800"
                                                }`}>
                                                {worker.status}
                                            </span>
                                        </td>
                                        <td className="p-3 border-b">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/workers/${worker.id}`, { state: { worker } });
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

                    {/* 🎯 **Pagination** */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-gray-600">
                            Showing {indexOfFirstWorker + 1}-
                            {Math.min(indexOfLastWorker, filteredWorkers.length)} of {filteredWorkers.length} workers
                        </p>
                        <div className="flex gap-2">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                                Prev
                            </button>
                            <button disabled={currentPage >= Math.ceil(filteredWorkers.length / workersPerPage)} onClick={() => setCurrentPage(prev => prev + 1)} className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
