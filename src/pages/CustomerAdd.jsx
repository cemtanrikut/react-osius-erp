import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaPlus, FaArrowLeft, FaUserCircle, FaMapMarkerAlt, FaHashtag,
    FaGlobe, FaFlag, FaCalendarAlt, FaPhone, FaEnvelope, FaCheckCircle,
    FaBuilding, FaClipboardList, FaUsers, FaTrash, FaFileUpload,
    FaStickyNote, FaClock, FaExpandArrowsAlt, FaIdCard, FaFileSignature,
    FaGlobeAmericas, FaLanguage, FaProjectDiagram, FaCodeBranch, FaIdBadge
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function CustomerAdd() {
    const navigate = useNavigate();
    const [newCustomer, setNewCustomer] = useState({
        name: "", address: "", postCode: "", plaats: "", country: "",
        date: "", phone: "", email: "", password: "", website: "", status: "Active",
        btwNumber: "", kvk: "", supplier: false, remarks: ""
    });

    // 👥 Contactpersonen için dinamik alanlar
    const [contacts, setContacts] = useState([{ firstName: "", email: "", password: "", role: "", phone: "" }]);
    const [showContacts, setShowContacts] = useState(false);


    const addContact = () => {
        setContacts([...contacts, { firstName: "", email: "", password: "", role: "", phone: "" }]);
    };

    const removeContact = (index) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };

    const addCustomer = async () => {
        if (!newCustomer.name || !newCustomer.address || !newCustomer.phone || !newCustomer.email || !newCustomer.kvk) {
            toast.error("All fields are required!", { position: "top-right" });
            return;
        }
    
        try {
            const API_URL = window.location.hostname === "localhost"
                ? "http://localhost:8080"
                : "https://api-osius.up.railway.app";
    
            // 📌 **Önce Customer'ı ekleyelim**
            const customerResponse = await fetch(`https://api-osius.up.railway.app/customers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCustomer),
            });
    
            if (!customerResponse.ok) {
                throw new Error("Failed to add customer");
            }
    
            const createdCustomer = await customerResponse.json();
            const customerId = createdCustomer.id; // 📌 API'den dönen Customer ID'yi al
    
            // 📌 **Contact Person'ları ekleyelim (eğer varsa)**
            if (contacts.length > 0) {
                await Promise.all(contacts.map(async (contact) => {
                    const contactData = {
                        customerId,  // 📌 Yeni oluşturulan müşteri ID'sini bağlayarak gönderiyoruz
                        buildingId: "", // 📌 BuildingID boş bırakılacak
                        firstName: contact.firstName,
                        email: contact.email,
                        password: contact.password,
                        role: contact.role,
                        phone: contact.phone
                    };
    
                    const contactResponse = await fetch(`https://api-osius.up.railway.app/contacts`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(contactData),
                    });
    
                    if (!contactResponse.ok) {
                        throw new Error("Failed to add contact person");
                    }
                }));
            }
    
            toast.success("Customer added successfully!", { position: "top-right" });
    
            // ✅ Başarıyla eklendiyse Customers sayfasına yönlendir
            setTimeout(() => {
                navigate("/dashboard/customers");
            }, 1500);
    
        } catch (error) {
            console.error("Error adding customer:", error);
            toast.error("Error adding customer. Please try again!", { position: "top-right" });
        }
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
                    {/* Password */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaHashtag className="text-gray-500 mr-2" />
                        <input
                            type="text" placeholder="Password" className="w-full outline-none"
                            value={newCustomer.password}
                            onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
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
                    {/* Status */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <select
                            className="w-full outline-none bg-transparent"
                            value={newCustomer.status}
                            onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    {/* Leverancier (Checkbox) */}
                    <label className="flex items-center mb-3">
                        <input
                            type="checkbox" className="mr-2"
                            checked={newCustomer.supplier}
                            onChange={(e) => setNewCustomer({ ...newCustomer, supplier: e.target.checked })}
                        /> Leverancier
                    </label>
                    {/* BTW-nummer */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaHashtag className="text-gray-500 mr-2" />
                        <input
                            type="text" placeholder="BTW-nummer" className="w-full outline-none"
                            value={newCustomer.btwNumber}
                            onChange={(e) => setNewCustomer({ ...newCustomer, btwNumber: e.target.value })}
                        />
                    </div>
                    {/* Kamer van Koophandel */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaBuilding className="text-blue-500 mr-2" />
                        <input
                            type="text" placeholder="Kamer van Koophandel" className="w-full outline-none"
                            value={newCustomer.kvk}
                            onChange={(e) => setNewCustomer({ ...newCustomer, kvk: e.target.value })}
                        />
                    </div>


                    {/* Vestigingsnummer */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaIdBadge className="text-gray-500 mr-2" />
                        <input
                            type="text" placeholder="Vestigingsnummer" className="w-full outline-none"
                            value={newCustomer.vestigingsnummer}
                            onChange={(e) => setNewCustomer({ ...newCustomer, vestigingsnummer: e.target.value })}
                        />
                    </div>
                    {/* Relatiebeheerder */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaUserCircle className="text-purple-500 mr-2" />
                        <input
                            type="text" placeholder="Relatiebeheerder" className="w-full outline-none"
                            value={newCustomer.relatiebeheerder}
                            onChange={(e) => setNewCustomer({ ...newCustomer, relatiebeheerder: e.target.value })}
                        />
                    </div>

                    {/* Global Location Number */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaGlobe className="text-green-500 mr-2" />
                        <input
                            type="text" placeholder="Global Location Number" className="w-full outline-none"
                            value={newCustomer.globalLocationNumber}
                            onChange={(e) => setNewCustomer({ ...newCustomer, globalLocationNumber: e.target.value })}
                        />
                    </div>


                    {/* Moederonderneming */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaBuilding className="text-indigo-500 mr-2" />
                        <input
                            type="text" placeholder="Moederonderneming" className="w-full outline-none"
                            value={newCustomer.moederonderneming}
                            onChange={(e) => setNewCustomer({ ...newCustomer, moederonderneming: e.target.value })}
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
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUsers /> Contactpersonen
            </h2>

            {showContacts ? (
                <>
                    {contacts.map((contact, index) => (
                        <div key={index} className="mb-4 border p-3 rounded-lg relative">
                            <input
                                type="text"
                                placeholder="Naam"
                                className="w-full border px-2 py-1 mb-2 rounded"
                                value={contact.firstName}
                                onChange={(e) => {
                                    const newContacts = [...contacts];
                                    newContacts[index].firstName = e.target.value;
                                    setContacts(newContacts);
                                }}
                            />
                            <input
                                type="email"
                                placeholder="E-mailadres"
                                className="w-full border px-2 py-1 mb-2 rounded"
                                value={contact.email}
                                onChange={(e) => {
                                    const newContacts = [...contacts];
                                    newContacts[index].email = e.target.value;
                                    setContacts(newContacts);
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full border px-2 py-1 mb-2 rounded"
                                value={contact.password}
                                onChange={(e) => {
                                    const newContacts = [...contacts];
                                    newContacts[index].password = e.target.value;
                                    setContacts(newContacts);
                                }}
                            />
                            <select
                                className="w-full border px-2 py-1 mb-2 rounded"
                                value={contact.role}
                                onChange={(e) => {
                                    const newContacts = [...contacts];
                                    newContacts[index].role = e.target.value;
                                    setContacts(newContacts);
                                }}
                            >
                                <option value="">Select Role</option>
                                <option value="Facility">Facility</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Manager">Manager</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Telefoon"
                                className="w-full border px-2 py-1 mb-2 rounded"
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
                </>
            ) : (
                <button
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg w-full"
                    onClick={() => setShowContacts(true)}
                >
                    + Add Contact Persons
                </button>
            )}
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
