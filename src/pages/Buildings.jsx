import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaFilter, FaPlus, FaEye, FaTimes, FaHashtag, FaUserCircle, FaPhone, FaHome, 
    FaEnvelope, FaCheckCircle, FaBuilding, FaLocationArrow, FaMapMarkerAlt, FaStickyNote, FaCalculator 
  } from "react-icons/fa";
  import toast, { Toaster } from "react-hot-toast";


// Rastgele müşteri verileri oluşturma
const generateBuildings = () => {
  const buildingNames = [
    "Rijksmuseum", "Van Gogh Museum", "Anne Frank House", "Erasmus Bridge", "Rotterdam Central Station",
    "Maastoren", "Euromast", "De Rotterdam", "Markthal", "Amsterdam Tower",
    "Eye Film Museum", "Nemo Science Museum", "Het Scheepvaartmuseum", "Teylers Museum", "Peace Palace",
    "Beurs van Berlage", "Dom Tower", "Groninger Museum", "The Hague Tower", "A'DAM Lookout",
    "Ziggo Dome", "AFAS Live", "GelreDome", "Johan Cruijff ArenA", "Philips Stadion",
    "Beatrix Theater", "Evoluon", "De Doelen", "Scheepvaartmuseum", "Het Loo Palace",
    "Hoge Veluwe National Park Center", "Leiden Observatory", "Binnenhof", "De Bijenkorf", "Erasmus MC",
    "Radboud University Medical Center", "Shell Headquarters", "ING House", "ABN AMRO Headquarters", "Rabobank Tower",
    "KPN Tower", "World Trade Center Amsterdam", "T-Mobile Office Rotterdam", "Unilever Benelux", "ASML Campus",
    "NXP Headquarters", "Booking.com Campus", "Bol.com HQ", "Coolblue Rotterdam", "WeTransfer HQ"
  ];

  return buildingNames.map((name, index) => ({
    id: `B-${index + 1}`,
    name,
    address: `Street ${index + 1}`,
    houseNo: `${Math.floor(10 + Math.random() * 90)}`,
    postCode: `10${Math.floor(100 + Math.random() * 900)}`,
    plaats: ["Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Eindhoven"][Math.floor(Math.random() * 5)],
    status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)],
    note: `Note for ${name}`,
    calculateType: ["Fixed", "Variable", "Custom"][Math.floor(Math.random() * 3)]
  }));
};

export default function Buildings() {
    const navigate = useNavigate();
  const [buildings, setBuildings] = useState(generateBuildings());
  const [filteredBuildings, setFilteredBuildings] = useState(buildings);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const buildingsPerPage = 13;
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchPostCode, setSearchPostCode] = useState("");
  const [searchPlaats, setSearchPlaats] = useState("");
  const [calculateTypeFilter, setCalculateTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filterBuildings = () => {
    let filtered = buildings.filter((building) =>
        (searchId ? building.id.toLowerCase().includes(searchId.toLowerCase()) : true) &&
        (searchName ? building.name.toLowerCase().includes(searchName.toLowerCase()) : true) &&
        (searchPostCode ? building.postCode.includes(searchPostCode) : true) &&
        (searchPlaats ? building.plaats.toLowerCase().includes(searchPlaats.toLowerCase()) : true) &&
        (statusFilter ? building.status === statusFilter : true) &&
        (calculateTypeFilter ? building.calculateType === calculateTypeFilter : true)
    );

    setFilteredBuildings(filtered);
    setCurrentPage(1); // Filtreleme sonrası sayfa 1'e dönsün
    };

    // Filtreleme inputlarında değişiklik oldukça çalıştır
    useEffect(() => {
        filterBuildings();
    }, [searchId, searchName, searchPostCode, searchPlaats, statusFilter, calculateTypeFilter]);

  

  // Clear butonu için fonksiyon
  const clearFilters = () => {
    setSearchId("");
    setSearchName("");
    setStatusFilter("");
    setFilteredBuildings(buildings);
    setCurrentPage(1);
    setSearchPostCode("");
    setSearchPlaats("");
    setCalculateTypeFilter("");
  };

  // 🏗 **Backend'den Bina Verilerini Çekme**
  useEffect(() => {
    const fetchBuildings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://api-osius.up.railway.app/buildings");
            if (!response.ok) {
                throw new Error("Failed to fetch buildings");
            }
            const data = await response.json();
            setBuildings(data);
            setFilteredBuildings(data); // Filtrelenmiş listeyi de başlat
        } catch (error) {
            console.error("Error fetching buildings:", error);
            toast.error("Error fetching buildings!", { position: "top-right" });
        } finally {
            setIsLoading(false);
        }
    };

    fetchBuildings();
  }, []);

  // Pagination hesaplama
  const indexOfLastBuilding = currentPage * buildingsPerPage;
  const indexOfFirstBuilding = indexOfLastBuilding - buildingsPerPage;
  const currentBuildings = filteredBuildings.slice(indexOfFirstBuilding, indexOfLastBuilding);

  return (
    <div className="p-6">
        <Toaster /> {/* 🚀 **Toast Mesajlarını Gösterir** */}
        <h1 className="text-2xl font-bold mb-6">Buildings</h1>
      {/* 🎯 Filtreleme Alanı */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center gap-4">
        <FaFilter className="text-gray-600" />

        {/* 🔎 Search by ID */}
        <div className="flex items-center border px-3 py-2 rounded-lg w-48">
            <FaHashtag className="text-gray-500 mr-2" />
            <input
            type="text"
            placeholder="Search by ID"
            className="w-full outline-none"
            value={searchId}
            onChange={(e) => {
                setSearchId(e.target.value);
                filterBuildings(e.target.value, searchName, searchPostCode, searchPlaats, statusFilter, calculateTypeFilter);
            }}
            />
        </div>

        {/* 🔎 Search by Name */}
        <div className="flex items-center border px-3 py-2 rounded-lg w-48">
            <FaBuilding className="text-blue-500 mr-2" />
            <input
            type="text"
            placeholder="Search by Name"
            className="w-full outline-none"
            value={searchName}
            onChange={(e) => {
                setSearchName(e.target.value);
                filterBuildings(searchId, e.target.value, searchPostCode, searchPlaats, statusFilter, calculateTypeFilter);
            }}
            />
        </div>

        {/* 🔎 Search by Post Code */}
        <div className="flex items-center border px-3 py-2 rounded-lg w-40">
            <FaHashtag className="text-orange-500 mr-2" />
            <input
            type="text"
            placeholder="Search by Post Code"
            className="w-full outline-none"
            value={searchPostCode}
            onChange={(e) => {
                setSearchPostCode(e.target.value);
                filterBuildings(searchId, searchName, e.target.value, searchPlaats, statusFilter, calculateTypeFilter);
            }}
            />
        </div>

        {/* 📍 Filter by Plaats */}
        <div className="flex items-center border px-3 py-2 rounded-lg w-40">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <select
            className="w-full outline-none bg-transparent"
            value={searchPlaats}
            onChange={(e) => {
                setSearchPlaats(e.target.value);
                filterBuildings(searchId, searchName, searchPostCode, e.target.value, statusFilter, calculateTypeFilter);
            }}
            >
            <option value="">Filter by Plaats</option>
            <option value="Amsterdam">Amsterdam</option>
            <option value="Rotterdam">Rotterdam</option>
            <option value="Utrecht">Utrecht</option>
            <option value="The Hague">The Hague</option>
            <option value="Eindhoven">Eindhoven</option>
            </select>
        </div>

        {/* ✅ Filter by Status */}
        <div className="flex items-center border px-3 py-2 rounded-lg w-40">
            <FaCheckCircle className="text-green-500 mr-2" />
            <select
            className="w-full outline-none bg-transparent"
            value={statusFilter}
            onChange={(e) => {
                setStatusFilter(e.target.value);
                filterBuildings(searchId, searchName, searchPostCode, searchPlaats, e.target.value, calculateTypeFilter);
            }}
            >
            <option value="">Filter by Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            </select>
        </div>

        {/* 📊 Filter by Calculate Type */}
        <div className="flex items-center border px-3 py-2 rounded-lg w-40">
            <FaCalculator className="text-indigo-500 mr-2" />
            <select
            className="w-full outline-none bg-transparent"
            value={calculateTypeFilter}
            onChange={(e) => {
                setCalculateTypeFilter(e.target.value);
                filterBuildings(searchId, searchName, searchPostCode, searchPlaats, statusFilter, e.target.value);
            }}
            >
            <option value="">Filter by Calculate Type</option>
            <option value="Type A">Type A</option>
            <option value="Type B">Type B</option>
            <option value="Type C">Type C</option>
            </select>
        </div>

        {/* ❌ Clear Filters */}
        <button
            className="bg-gray-500 text-white px-3 py-2 rounded-lg"
            onClick={clearFilters}
        >
            Clear
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 ml-auto flex items-center"
            // onClick={() => setIsAddModalOpen(true)}>
                onClick={() => 
                    navigate("/dashboard/buildings/add")
                }>
          <FaPlus className="mr-2" />
          Add Building
        </button>
      </div>

      {/* 🎯 Add Building Modal */}
        {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">Add New Building</h2>
                <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-red-500"
                >
                <FaTimes />
                </button>
            </div>

            <div className="mt-3 space-y-3">
                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaBuilding className="text-blue-500 mr-2" />
                <input
                    type="text"
                    placeholder="Building Name"
                    className="w-full outline-none"
                    value={newBuilding.name}
                    onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaLocationArrow className="text-green-500 mr-2" />
                <input
                    type="text"
                    placeholder="Address"
                    className="w-full outline-none"
                    value={newBuilding.address}
                    onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaHome className="text-purple-500 mr-2" />
                <input
                    type="text"
                    placeholder="House No."
                    className="w-full outline-none"
                    value={newBuilding.houseNo}
                    onChange={(e) => setNewBuilding({ ...newBuilding, houseNo: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaHashtag className="text-orange-500 mr-2" />
                <input
                    type="text"
                    placeholder="Post Code"
                    className="w-full outline-none"
                    value={newBuilding.postCode}
                    onChange={(e) => setNewBuilding({ ...newBuilding, postCode: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <input
                    type="text"
                    placeholder="Plaats"
                    className="w-full outline-none"
                    value={newBuilding.plaats}
                    onChange={(e) => setNewBuilding({ ...newBuilding, plaats: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaCheckCircle className="text-green-500 mr-2" />
                <select
                    className="w-full outline-none bg-transparent"
                    value={newBuilding.status}
                    onChange={(e) => setNewBuilding({ ...newBuilding, status: e.target.value })}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                </select>
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaStickyNote className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Note"
                    className="w-full outline-none"
                    value={newBuilding.note}
                    onChange={(e) => setNewBuilding({ ...newBuilding, note: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaCalculator className="text-indigo-500 mr-2" />
                <select
                    className="w-full outline-none bg-transparent"
                    value={newBuilding.calculateType}
                    onChange={(e) => setNewBuilding({ ...newBuilding, calculateType: e.target.value })}
                >
                    <option value="Type A">Type A</option>
                    <option value="Type B">Type B</option>
                    <option value="Type C">Type C</option>
                </select>
                </div>

                <button
                onClick={addBuilding}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                <FaPlus />
                Add Building
                </button>
            </div>
            </div>
        </div>
        )}



      {/* 🎯 Building Listesi */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          {/* Tablo Başlıkları */}
            <thead className="bg-gray-100">
                <tr className="text-left">
                <th className="p-3 border-b"><FaHashtag className="inline-block mr-2 text-gray-500" />ID</th>
                <th className="p-3 border-b"><FaBuilding className="inline-block mr-2 text-gray-500" />Name</th>
                <th className="p-3 border-b"><FaLocationArrow className="inline-block mr-2 text-gray-500" />Address</th>
                <th className="p-3 border-b"><FaMapMarkerAlt className="inline-block mr-2 text-gray-500" />House No.</th>
                <th className="p-3 border-b"><FaHashtag className="inline-block mr-2 text-gray-500" />Post Code</th>
                <th className="p-3 border-b"><FaMapMarkerAlt className="inline-block mr-2 text-gray-500" />Plaats</th>
                <th className="p-3 border-b"><FaStickyNote className="inline-block mr-2 text-gray-500" />Note</th>
                <th className="p-3 border-b"><FaCalculator className="inline-block mr-2 text-gray-500" />Calculate Type</th>
                <th className="p-3 border-b"><FaCheckCircle className="inline-block mr-2 text-gray-500" />Status</th>
                <th className="p-3 border-b">Actions</th>
                </tr>
            </thead>
          {/* Tablo İçeriği */}
          <tbody>
            {currentBuildings.map((building) => (
                <tr 
                key={building.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/dashboard/buildings/${building.id}`, { state: { building } })}
              >                
                <td className="p-3 border-b">{building.id}</td>
                <td className="p-3 border-b">{building.name}</td>
                <td className="p-3 border-b">{building.address}</td>
                <td className="p-3 border-b">{building.houseNo}</td>
                <td className="p-3 border-b">{building.postCode}</td>
                <td className="p-3 border-b">{building.plaats}</td>
                <td className="p-3 border-b">{building.note}</td>
                <td className="p-3 border-b">{building.calculateType}</td>
                <td className="p-3 border-b">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    building.status === "Active"
                    ? "bg-green-300 text-green-800"
                    : building.status === "Inactive"
                    ? "bg-red-300 text-red-800"
                    : "bg-yellow-300 text-yellow-800"
                }`}>
                    {building.status}
                </span>
                </td>
                <td className="p-3 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation(); // Satırın tıklanmasını engelleme
                        navigate(`/dashboard/buildings/${building.id}`, { state: { building } });
                      }}                    >
                      <FaEye />
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🎯 Building Detail Modal */}
        {selectedBuilding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">Building Details</h2>
                <button
                onClick={() => setSelectedBuilding(null)}
                className="text-gray-500 hover:text-red-500"
                >
                <FaTimes />
                </button>
            </div>

            <div className="mt-3 space-y-3">
                <p className="flex items-center">
                <FaHashtag className="text-gray-500 mr-2" />
                <strong>ID:</strong> {selectedBuilding.id}
                </p>
                <p className="flex items-center">
                <FaBuilding className="text-blue-500 mr-2" />
                <strong>Name:</strong> {selectedBuilding.name}
                </p>
                <p className="flex items-center">
                <FaLocationArrow className="text-green-500 mr-2" />
                <strong>Address:</strong> {selectedBuilding.address}
                </p>
                <p className="flex items-center">
                <FaHome className="text-purple-500 mr-2" />
                <strong>House No.:</strong> {selectedBuilding.houseNo}
                </p>
                <p className="flex items-center">
                <FaHashtag className="text-orange-500 mr-2" />
                <strong>Post Code:</strong> {selectedBuilding.postCode}
                </p>
                <p className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <strong>Plaats:</strong> {selectedBuilding.plaats}
                </p>
                <p className="flex items-center">
                <FaCheckCircle
                    className={`mr-2 ${
                    selectedBuilding.status === "Active"
                        ? "text-green-500"
                        : selectedBuilding.status === "Inactive"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                />
                <strong>Status:</strong> {selectedBuilding.status}
                </p>
                <p className="flex items-center">
                <FaStickyNote className="text-gray-500 mr-2" />
                <strong>Note:</strong> {selectedBuilding.note}
                </p>
                <p className="flex items-center">
                <FaCalculator className="text-indigo-500 mr-2" />
                <strong>Calculate Type:</strong> {selectedBuilding.calculateType}
                </p>
            </div>
            </div>
        </div>
        )}



      {/* 🎯 Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">Showing {indexOfFirstBuilding + 1}-{indexOfLastBuilding} of {filteredBuildings.length} buildings</p>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <button
            className={`px-3 py-1 rounded-lg ${currentPage === Math.ceil(filteredBuildings.length / buildingsPerPage) ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            disabled={currentPage === Math.ceil(filteredBuildings.length / buildingsPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
