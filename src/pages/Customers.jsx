import { useState } from "react";
import { FaFilter, FaPlus, FaEye, FaTimes, FaHashtag, FaUserCircle, FaPhone, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";


// Rastgele müşteri verileri oluşturma
const generateCustomers = () => {
  const companyNames = [
    "Philips", "Heineken", "KLM", "Shell", "ASML", "Unilever", "Rabobank", "ING Group",
    "Ahold Delhaize", "DSM", "PostNL", "Randstad", "ABN AMRO", "TNT Express", "Bosch",
    "AkzoNobel", "KPN", "TomTom", "Booking.com", "Bol.com", "Coolblue", "VanMoof", "NXP Semiconductors",
    "Fokker", "Tata Steel Netherlands", "Vattenfall Netherlands", "BAM Group", "Arcadis", "FrieslandCampina",
    "WeTransfer", "Thales Netherlands", "Signify", "Vopak", "Exact", "Basic-Fit", "ASR Nederland",
    "Bugaboo", "NS (Dutch Railways)", "Nederlandse Loterij", "Lely", "Takeaway.com", "Tony’s Chocolonely",
    "Damen Shipyards", "Eneco", "Otravo", "Bitvavo", "Bynder", "Just Eat Takeaway", "Payvision"
  ];

  return companyNames.map((name, index) => ({
    id: `C-${index + 1}`,
    name,
    phone: `+31 6 ${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `${name.toLowerCase().replace(/\s+/g, "")}@example.com`,
    status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)]
  }));
};

export default function Customers() {
  const [customers, setCustomers] = useState(generateCustomers());
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 13;
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", status: "Active" });


  // Filtreleme Fonksiyonu
  const filterCustomers = (id, name, status) => {
    let filtered = customers.filter((customer) =>
      (id ? customer.id.includes(id) : true) &&
      (name ? customer.name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (status ? customer.status === status : true)
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1); // Filtreleme sonrası sayfa 1'e dönsün
  };

  // Clear butonu için fonksiyon
  const clearFilters = () => {
    setSearchId("");
    setSearchName("");
    setStatusFilter("");
    setFilteredCustomers(customers);
    setCurrentPage(1);
  };

  // ✅ **Müşteri Ekleme Fonksiyonu (DÜZELTİLDİ)**
  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.email) {
      toast.error("All fields are required!", { position: "top-right" });
      return;
    }

    const newId = `C-${customers.length + 1}`;
    const newEntry = { id: newId, ...newCustomer };

    setCustomers((prevCustomers) => {
      const updatedCustomers = [newEntry, ...prevCustomers];
      setFilteredCustomers(updatedCustomers); // **Filtreli listeyi de güncelle**
      return updatedCustomers;
    });

    setNewCustomer({ name: "", phone: "", email: "", status: "Active" }); // **Formu temizle**
    setIsAddModalOpen(false); // **Modalı kapat**
    
    toast.success("Customer added successfully!", { position: "top-right" });
  };

  // Pagination hesaplama
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <div className="p-6">
        <Toaster /> {/* 🚀 **Toast Mesajlarını Gösterir** */}
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
            filterCustomers(e.target.value, searchName, statusFilter);
          }}
        />
        <input
          type="text"
          placeholder="Search by Name"
          className="border px-3 py-2 rounded-lg"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            filterCustomers(searchId, e.target.value, statusFilter);
          }}
        />
        <select
          className="border px-3 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            filterCustomers(searchId, searchName, e.target.value);
          }}
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
            onClick={() => setIsAddModalOpen(true)}>
          <FaPlus className="mr-2" />
          Add Customer
        </button>
      </div>

      {/* 🎯 Add Customer Modal */}
        {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">Add New Customer</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-red-500">
                <FaTimes />
                </button>
            </div>

            <div className="mt-3 space-y-3">
                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaUserCircle className="text-blue-500 mr-2" />
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full outline-none"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaPhone className="text-green-500 mr-2" />
                <input
                    type="text"
                    placeholder="Phone"
                    className="w-full outline-none"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
                </div>

                <div className="flex items-center border px-3 py-2 rounded-lg w-full">
                <FaEnvelope className="text-red-500 mr-2" />
                <input
                    type="text"
                    placeholder="Email"
                    className="w-full outline-none"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
                </div>

                <button
                onClick={addCustomer}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                <FaPlus />
                Add Customer
                </button>
            </div>
            </div>
        </div>
        )}


      {/* 🎯 Müşteri Listesi */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          {/* Tablo Başlıkları */}
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
          {/* Tablo İçeriği */}
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{customer.id}</td>
                <td className="p-3 border-b">{customer.name}</td>
                <td className="p-3 border-b">{customer.phone}</td>
                <td className="p-3 border-b">{customer.email}</td>
                <td className="p-3 border-b">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    customer.status === "Active"
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
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <FaEye />
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🎯 Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">Customer Details</h2>
                <button onClick={() => setSelectedCustomer(null)} className="text-gray-500 hover:text-red-500">
                <FaTimes />
                </button>
            </div>
            
            <div className="mt-3 space-y-3">
                <p className="flex items-center">
                <FaHashtag className="text-gray-500 mr-2" />
                <strong>ID:</strong> {selectedCustomer.id}
                </p>
                <p className="flex items-center">
                <FaUserCircle className="text-blue-500 mr-2" />
                <strong>Name:</strong> {selectedCustomer.name}
                </p>
                <p className="flex items-center">
                <FaPhone className="text-green-500 mr-2" />
                <strong>Phone:</strong> {selectedCustomer.phone}
                </p>
                <p className="flex items-center">
                <FaEnvelope className="text-red-500 mr-2" />
                <strong>Email:</strong> {selectedCustomer.email}
                </p>
                <p className="flex items-center">
                <FaCheckCircle className={`mr-2 ${selectedCustomer.status === "Active" ? "text-green-500" : selectedCustomer.status === "Inactive" ? "text-red-500" : "text-yellow-500"}`} />
                <strong>Status:</strong> {selectedCustomer.status}
                </p>
            </div>
            </div>
        </div>
        )}


      {/* 🎯 Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">Showing {indexOfFirstCustomer + 1}-{indexOfLastCustomer} of {filteredCustomers.length} customers</p>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <button
            className={`px-3 py-1 rounded-lg ${currentPage === Math.ceil(filteredCustomers.length / customersPerPage) ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            disabled={currentPage === Math.ceil(filteredCustomers.length / customersPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
