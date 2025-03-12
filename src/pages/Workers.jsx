import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaFilter, FaPlus, FaEye, FaTimes, FaUserCircle, FaPhone, 
    FaEnvelope, FaCheckCircle, FaArrowRight, FaArrowLeft, 
    FaIdBadge, FaBriefcase, FaMoneyBillWave, FaCalendarAlt,
    FaEdit
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

// Rastgele worker verileri oluşturma
const generateWorkers = () => {
  const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry"];
  const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

  return Array.from({ length: 50 }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return {
      id: `W-${index + 1}`,
      name: `${firstName} ${lastName}`,
      phone: `+31 6 ${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      status: ["Active", "Inactive", "On Leave"][Math.floor(Math.random() * 3)]
    };
  });
};

export default function Workers() {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState(generateWorkers());
    const [filteredWorkers, setFilteredWorkers] = useState(workers);
    const [searchId, setSearchId] = useState("");
    const [searchName, setSearchName] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const workersPerPage = 10;
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newWorker, setNewWorker] = useState({ name: "", phone: "", email: "", department: "", role: "", startDate: "", status: "Active" });
  
  // Filtreleme Fonksiyonu
  const filterWorkers = (id, name, status) => {
    let filtered = workers.filter((worker) =>
      (id ? worker.id.includes(id) : true) &&
      (name ? worker.name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (status ? worker.status === status : true)
    );
    setFilteredWorkers(filtered);
    setCurrentPage(1);
  };

  // Filtreleri Temizleme
  const clearFilters = () => {
    setSearchId("");
    setSearchName("");
    setStatusFilter("");
    setFilteredWorkers(workers);
    setCurrentPage(1);
  };

  // ✅ **Worker Ekleme**
  const addWorker = () => {
    if (!newWorker.name || !newWorker.phone || !newWorker.email || !newWorker.department || !newWorker.role || !newWorker.startDate) {
      toast.error("All fields are required!", { position: "top-right" });
      return;
    }

    const newId = `W-${workers.length + 1}`;
    const newEntry = { id: newId, ...newWorker };

    setWorkers((prevWorkers) => {
      const updatedWorkers = [newEntry, ...prevWorkers];
      setFilteredWorkers(updatedWorkers);
      return updatedWorkers;
    });

    setNewWorker({ name: "", phone: "", email: "", department: "", role: "", startDate: "", status: "Active" });
    setIsAddModalOpen(false);
    
    toast.success("Worker added successfully!", { position: "top-right" });
  };

  // Pagination hesaplama
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);

  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Workers</h1>
      {/* 🎯 Filtreleme Alanı */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center gap-4">
        <FaFilter className="text-gray-600" />
        <input
          type="text"
          placeholder="Search by ID"
          className="border px-3 py-2 rounded-lg"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            filterWorkers(e.target.value, searchName, statusFilter);
          }}
        />
        <input
          type="text"
          placeholder="Search by Name"
          className="border px-3 py-2 rounded-lg"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            filterWorkers(searchId, e.target.value, statusFilter);
          }}
        />
        <select
          className="border px-3 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            filterWorkers(searchId, searchName, e.target.value);
          }}
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
            onClick={() => {
                setIsAddModalOpen(true); // Modalı aç
                setNewWorker({ name: "", phone: "", email: "", department: "", role: "", startDate: "", status: "Active" }); // Formu sıfırla
            }}
            >
            <FaPlus className="mr-2" />
            Add Worker
            </button>

      </div>

      {/* 🎯 Worker Listesi */}
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
            {currentWorkers.map((worker) => (
                <tr 
                  key={worker.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/dashboard/workers/${worker.id}`, { state: { worker } })}
                >                
                <td className="p-3 border-b">{worker.id}</td>
                <td className="p-3 border-b">{worker.name}</td>
                <td className="p-3 border-b">{worker.phone}</td>
                <td className="p-3 border-b">{worker.email}</td>
                <td className="p-3 border-b">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    worker.status === "Active"
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
                      }}                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🎯 Worker Detay Modalı */}
{selectedWorker && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaUserCircle className="text-blue-500" /> Worker Details
        </h2>
        <button 
          className="text-gray-500 hover:text-red-500" 
          onClick={() => setSelectedWorker(null)}
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-3">
        <p className="flex items-center">
          <FaUserCircle className="text-blue-500 mr-2" />
          <strong>Name:</strong> {selectedWorker.name}
        </p>

        <p className="flex items-center">
          <FaPhone className="text-green-500 mr-2" />
          <strong>Phone:</strong> {selectedWorker.phone}
        </p>

        <p className="flex items-center">
          <FaEnvelope className="text-red-500 mr-2" />
          <strong>Email:</strong> {selectedWorker.email}
        </p>

        <p className="flex items-center">
          <FaCheckCircle 
            className={`mr-2 ${
              selectedWorker.status === "Active" 
                ? "text-green-500" 
                : selectedWorker.status === "Inactive" 
                ? "text-red-500" 
                : "text-yellow-500"
            }`} 
          />
          <strong>Status:</strong> {selectedWorker.status}
        </p>
      </div>

      {/* 🎯 Update & Close Butonları */}
      <div className="mt-4 flex gap-3">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-600"
          onClick={() => console.log("Update Worker: ", selectedWorker)}
        >
          <FaEdit className="mr-2" /> Update
        </button>

        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center w-full hover:bg-red-600"
          onClick={() => setSelectedWorker(null)}
        >
          <FaTimes className="mr-2" /> Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* 🎯 Worker Ekleme Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2"><FaPlus /> Add Worker</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-red-500">
                <FaTimes />
              </button>
            </div>

            <div className="mt-3 space-y-3">
  {/* Full Name Input */}
  <div className="flex items-center border px-3 py-2 rounded-lg">
    <FaUserCircle className="text-blue-500 mr-2" />
    <input 
      type="text" 
      placeholder="Full Name" 
      className="w-full outline-none" 
      value={newWorker.name} 
      onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} 
    />
  </div>

  {/* Phone Input */}
  <div className="flex items-center border px-3 py-2 rounded-lg">
    <FaPhone className="text-green-500 mr-2" />
    <input 
      type="text" 
      placeholder="Phone" 
      className="w-full outline-none" 
      value={newWorker.phone} 
      onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })} 
    />
  </div>

  {/* Email Input */}
  <div className="flex items-center border px-3 py-2 rounded-lg">
    <FaEnvelope className="text-red-500 mr-2" />
    <input 
      type="email" 
      placeholder="Email" 
      className="w-full outline-none" 
      value={newWorker.email} 
      onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })} 
    />
  </div>
</div>


            <button 
            className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
            onClick={addWorker}
            >
            <FaPlus className="text-sm" />
            <span>Add Worker</span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
