import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaPlus, FaArrowLeft, FaUserCircle, FaMapMarkerAlt, FaHashtag, 
    FaGlobe, FaFlag, FaCalendarAlt, FaPhone, FaEnvelope, FaCheckCircle, 
    FaBuilding, FaClipboardList, FaUsers, FaTrash, FaFileUpload, 
    FaStickyNote, FaClock, FaExpandArrowsAlt, FaIdCard, FaFileSignature
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function CustomerAdd() {
  const navigate = useNavigate();
  const [newCustomer, setNewCustomer] = useState({
    name: "", address: "", postCode: "", plaats: "", country: "",
    date: "", phone: "", email: "", website: "", status: "Active",
    btwNumber: "", kvk: "", oin: "", supplier: false, remarks: ""
  });

  // 👥 Contactpersonen için dinamik alanlar
  const [contacts, setContacts] = useState([{ firstName: "", lastName: "", email: "", phone: "" }]);

  const addContact = () => {
    setContacts([...contacts, { firstName: "", lastName: "", email: "", phone: "" }]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.address || !newCustomer.postCode || !newCustomer.plaats || !newCustomer.country) {
      toast.error("All fields are required!", { position: "top-right" });
      return;
    }

    toast.success("Customer added successfully!", { position: "top-right" });

    // ✅ Customer eklendikten sonra Customers sayfasına yönlendir
    setTimeout(() => {
      navigate("/dashboard/customers");
    }, 1500);
  };

  return (
    <div className="p-6">
      <Toaster />

      {/* 🔙 Geri Butonu */}
      <button 
        className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 mb-4"
        onClick={() => navigate("/dashboard/customers")}
      >
        <FaArrowLeft /> Back to Customers
      </button>

      {/* 🆕 Yeni Customer Ekleme */}
      <h1 className="text-2xl font-bold mb-6">Add Customer</h1>

      {/* 📌 Sayfa Üçe Bölündü */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full flex gap-6">

        {/* 🔹 Informatie (Bilgi) */}
        <div className="w-1/3">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaBuilding /> Informatie</h2>

          {/* Customer Name */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaUserCircle className="text-blue-500 mr-2" />
            <input 
              type="text" placeholder="Naam" className="w-full outline-none"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <input 
              type="text" placeholder="Adres" className="w-full outline-none"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
            />
          </div>

          {/* Post Code */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaHashtag className="text-gray-500 mr-2" />
            <input 
              type="text" placeholder="Postcode" className="w-full outline-none"
              value={newCustomer.postCode}
              onChange={(e) => setNewCustomer({ ...newCustomer, postCode: e.target.value })}
            />
          </div>

          {/* Plaats / Province */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaGlobe className="text-green-500 mr-2" />
            <input 
              type="text" placeholder="Plaats / Province" className="w-full outline-none"
              value={newCustomer.plaats}
              onChange={(e) => setNewCustomer({ ...newCustomer, plaats: e.target.value })}
            />
          </div>

          {/* Country */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaFlag className="text-yellow-500 mr-2" />
            <input 
              type="text" placeholder="Land" className="w-full outline-none"
              value={newCustomer.country}
              onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaPhone className="text-blue-500 mr-2" />
            <input 
              type="text" placeholder="Telefoon" className="w-full outline-none"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaEnvelope className="text-red-500 mr-2" />
            <input 
              type="email" placeholder="E-mailadres" className="w-full outline-none"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
          </div>

          {/* Website */}
          <div className="flex items-center border px-3 py-2 rounded-lg">
            <FaGlobe className="text-green-500 mr-2" />
            <input 
              type="text" placeholder="Website" className="w-full outline-none"
              value={newCustomer.website}
              onChange={(e) => setNewCustomer({ ...newCustomer, website: e.target.value })}
            />
          </div>
          {/* Logo Upload */}
          <div className="flex items-center border mt-3 px-3 py-2 rounded-lg">
            <FaFileUpload className="text-gray-500 mr-2" />
                <input 
                type="file" placeholder="Logo" className="w-full outline-none"
                value={newCustomer.logo}
                onChange={(e) => setNewCustomer({ ...newCustomer, logo: e.target.files[0] })}
            />
            </div>
        </div>
          

         {/* 🔹 Algemeen (Genel Bilgiler) */}
         <div className="w-1/3">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaClipboardList /> Algemeen</h2>

          {/* Kamer van Koophandel */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaBuilding className="text-blue-500 mr-2" />
            <input 
              type="text" placeholder="Kamer van Koophandel" className="w-full outline-none"
              value={newCustomer.kvk}
              onChange={(e) => setNewCustomer({ ...newCustomer, kvk: e.target.value })}
            />
          </div>

          {/* OIN */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaIdCard className="text-gray-500 mr-2" />
            <input 
              type="text" placeholder="OIN" className="w-full outline-none"
              value={newCustomer.oin}
              onChange={(e) => setNewCustomer({ ...newCustomer, oin: e.target.value })}
            />
          </div>

          {/* Opmerkingen */}
          <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
            <FaStickyNote className="text-gray-500 mr-2" />
            <input 
              type="text" placeholder="Opmerkingen" className="w-full outline-none"
              value={newCustomer.remarks}
              onChange={(e) => setNewCustomer({ ...newCustomer, remarks: e.target.value })}
            />
          </div>

          {/* Tijdstempel & Volledig Scherm Butonları */}
          <div className="flex gap-2">
            <button className="bg-gray-400 text-white px-3 py-2 rounded-lg flex items-center gap-2">
              <FaClock /> Tijdstempel
            </button>
            <button className="bg-gray-400 text-white px-3 py-2 rounded-lg flex items-center gap-2">
              <FaExpandArrowsAlt /> Volledig scherm
            </button>
          </div>
        </div>

        {/* 🔹 Contactpersonen (Kişiler) */}
        <div className="w-1/3">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaUsers /> Contactpersonen</h2>

          {contacts.map((contact, index) => (
            <div key={index} className="mb-4 border p-3 rounded-lg relative">
              <input 
                type="text" placeholder="Voornaam" className="w-full border px-2 py-1 mb-2 rounded"
                value={contact.firstName}
                onChange={(e) => {
                  const newContacts = [...contacts];
                  newContacts[index].firstName = e.target.value;
                  setContacts(newContacts);
                }}
              />
              <input 
                type="text" placeholder="Achternaam" className="w-full border px-2 py-1 mb-2 rounded"
                value={contact.lastName}
                onChange={(e) => {
                  const newContacts = [...contacts];
                  newContacts[index].lastName = e.target.value;
                  setContacts(newContacts);
                }}
              />
              <input 
                type="text" placeholder="E-mailadres" className="w-full border px-2 py-1 mb-2 rounded"
                value={contact.email}
                onChange={(e) => {
                  const newContacts = [...contacts];
                  newContacts[index].email = e.target.value;
                  setContacts(newContacts);
                }}
              />
              <input 
                type="text" placeholder="Telefoon" className="w-full border px-2 py-1 mb-2 rounded"
                value={contact.phone}
                onChange={(e) => {
                  const newContacts = [...contacts];
                  newContacts[index].phone = e.target.value;
                  setContacts(newContacts);
                }}
              />
              <button className="absolute top-2 right-2 text-red-500" onClick={() => removeContact(index)}>
                <FaTrash />
              </button>
            </div>
          ))}

          <button className="bg-blue-500 text-white px-3 py-2 rounded-lg w-full" onClick={addContact}>
            + Add Contactpersoon
          </button>
        </div>
      </div>

      {/* ✅ Add Customer Butonu */}
      <button 
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 flex items-center justify-center gap-2"
        onClick={addCustomer}
      >
        <FaPlus /> Add Customer
      </button>
    </div>
  );
}
