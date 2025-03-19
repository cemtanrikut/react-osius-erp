import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFilter, FaPlus, FaEye, FaTimes, FaCheckCircle, FaBuilding, FaMapMarkerAlt, FaCalculator
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function Buildings() {
    const navigate = useNavigate();
    const [buildings, setBuildings] = useState([]); // Fake veriler kaldırıldı
    const [filteredBuildings, setFilteredBuildings] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchPostCode, setSearchPostCode] = useState("");
    const [searchPlaats, setSearchPlaats] = useState("");
    const [statusFilter, setStatusFilter] = useState("Active");
    const [calculateTypeFilter, setCalculateTypeFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const buildingsPerPage = 13;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Hata kontrolü eklendi

    // 📌 **Backend'den Veriyi Çekme**
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const API_URL = window.location.hostname === "localhost"
                    ? "http://localhost:8080"
                    : "https://api-osius.up.railway.app";

                const response = await fetch(`${API_URL}/buildings`); // Hatalı string çıkarıldı
                if (!response.ok) throw new Error("Failed to fetch buildings");

                const data = await response.json();
                setBuildings(data);
                setFilteredBuildings(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching buildings:", error);
                setError("Failed to load buildings.");
                setLoading(false);
            }
        };

        fetchBuildings();
    }, []);

    // 🔍 **Filtreleme Fonksiyonu**
    useEffect(() => {
        let filtered = buildings.filter((building) =>
            (searchName ? building.name.toLowerCase().includes(searchName.toLowerCase()) : true) &&
            (searchPostCode ? building.postCode.includes(searchPostCode) : true) &&
            (searchPlaats ? building.plaats.toLowerCase().includes(searchPlaats.toLowerCase()) : true) &&
            (statusFilter ? building.status === statusFilter : true) &&
            (calculateTypeFilter ? building.calculateType === calculateTypeFilter : true)
        );

        setFilteredBuildings(filtered);
    }, [searchName, searchPostCode, searchPlaats, statusFilter, calculateTypeFilter, buildings]);

    // Filtreleri temizleme
    const clearFilters = () => {
        setSearchName("");
        setSearchPostCode("");
        setSearchPlaats("");
        setStatusFilter("Active");
        setCalculateTypeFilter("");
    };

    // **Pagination hesaplama**
    const indexOfLastBuilding = currentPage * buildingsPerPage;
    const indexOfFirstBuilding = indexOfLastBuilding - buildingsPerPage;
    const currentBuildings = (filteredBuildings || []).slice(indexOfFirstBuilding, indexOfLastBuilding);

    return (
        <div className="p-6">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6">Buildings</h1>

            {/* **Eğer hata varsa göster** */}
            {error && <p className="text-red-500">{error}</p>}

            {/* **Eğer yükleniyorsa "Loading..." göster** */}
            {loading && <p className="text-gray-500">Loading...</p>}

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
                            placeholder="Search by Post Code"
                            className="border px-3 py-2 rounded-lg"
                            value={searchPostCode}
                            onChange={(e) => setSearchPostCode(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Search by Plaats"
                            className="border px-3 py-2 rounded-lg"
                            value={searchPlaats}
                            onChange={(e) => setSearchPlaats(e.target.value)}
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
                        <select
                            className="border px-3 py-2 rounded-lg"
                            value={calculateTypeFilter}
                            onChange={(e) => setCalculateTypeFilter(e.target.value)}
                        >
                            <option value="">Filter by Calculate Type</option>
                            <option value="Type A">Type A</option>
                            <option value="Type B">Type B</option>
                            <option value="Type C">Type C</option>
                        </select>
                        <button className="bg-gray-500 text-white px-3 py-2 rounded-lg" onClick={clearFilters}>
                            Clear
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 ml-auto flex items-center"
                            onClick={() => navigate("/dashboard/buildings/add")}>
                            <FaPlus className="mr-2" />
                            Add Building
                        </button>
                    </div>

                    {/* 🎯 Building Listesi */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="w-full border-collapse">
        <thead className="bg-gray-100">
            <tr className="text-left">
                <th className="p-3 border-b">ID</th> {/* ✅ ID sütunu eklendi */}
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Post Code</th>
                <th className="p-3 border-b">Plaats</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
            </tr>
        </thead>
        <tbody>
            {currentBuildings.map((building) => (
                <tr key={building.id} className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/dashboard/buildings/${building.id}`, { state: { building } })}>
                    <td className="p-3 border-b">{building.id}</td> {/* ✅ ID değeri buraya eklendi */}
                    <td className="p-3 border-b">{building.name}</td>
                    <td className="p-3 border-b">{building.postCode}</td>
                    <td className="p-3 border-b">{building.plaats}</td>
                    <td className="p-3 border-b">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${building.status === "Active"
                            ? "bg-green-300 text-green-800"
                            : building.status === "Inactive"
                                ? "bg-red-300 text-red-800"
                                : "bg-yellow-300 text-yellow-800"
                            }`}>
                            {building.status}
                        </span>
                    </td>
                    <td className="p-3 border-b">
                        <button className="text-blue-500 hover:text-blue-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/dashboard/buildings/${building.id}`, { state: { building } });
                            }}>
                            <FaEye />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

                </>
            )}
        </div>
    );
}
