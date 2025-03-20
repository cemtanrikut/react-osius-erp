import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    FaUserCircle, FaPhone, FaEnvelope, FaArrowLeft, FaMapMarkerAlt,
    FaGlobe, FaFlag, FaCalendarAlt, FaCheckCircle, FaBuilding, FaClipboardList,
    FaUsers, FaHashtag, FaFileUpload, FaUser, FaPlus, FaTimes
} from "react-icons/fa";

// Örnek Müşteri Verisi (Gerçek veriyi API veya state'ten alabilirsin)
const customerData = [
    {
        id: "C-1",
        name: "Philips",
        phone: "+31 6 12345678",
        email: "philips@example.com",
        status: "Active",
        address: "Eindhoven",
        country: "Netherlands",
        postcode: "5600",
        startDate: "2023-10-01",
        website: "www.philips.com",
        btwNumber: "NL123456789B01",
        kvkNumber: "12345678",
        oin: "OIN123456",
        supplier: true,
        remarks: "Long-term customer",
    }
];

export default function CustomerDetail() {
    const { id } = useParams(); // URL'deki ID'yi alıyoruz
    const location = useLocation(); // React Router ile state'i alıyoruz
    const navigate = useNavigate();

    // Eğer state varsa kullan, yoksa ID'ye göre müşteriyi bul
    const customer = location.state?.customer || customerData.find((c) => c.id === id);
    const [contactPersons, setContactPersons] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [newContact, setNewContact] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        phone: "",
        password: "",
    });


    if (!customer) {
        return <div className="p-6">Customer not found.</div>;
    }

    useEffect(() => {
        const API_URL = window.location.hostname === "localhost"
            ? "http://localhost:8080"
            : "https://api-osius.up.railway.app";

        console.log("Fetching contacts for customer:", id);

        fetch(`https://api-osius.up.railway.app/contacts/customer/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched contact persons:", data);

                console.log("Current customerId:", id);
                console.log("Fetched contactPersons:", contactPersons);

                setContactPersons(data);

                // 🔥 Güncellenmiş state'i hemen görmek için:
                setTimeout(() => {
                    console.log("Updated contactPersons state:", contactPersons);
                }, 1000); // 1 saniye bekleyerek state’in değiştiğini görebiliriz
            })
            .catch((error) => console.error("Contact persons fetch error:", error));
    }, [id]);

    useEffect(() => {
        console.log("Updated contactPersons state:", contactPersons);
    }, [contactPersons]); // contactPersons değiştiğinde log at


    const handleAddContact = async () => {
        if (!newContact.firstName || !newContact.email || !newContact.role || !newContact.phone) {
            alert("All fields are required.");
            return;
        }

        const contactData = {
            ...newContact,
            customerId: id,
            buildingId: "", // Eğer BuildingID eklemek istersen buraya ekle
        };

        try {
            const response = await fetch(`https://api-osius.up.railway.app/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData),
            });

            if (!response.ok) {
                throw new Error("Failed to add contact.");
            }

            const addedContact = await response.json();
            setContactPersons([...contactPersons, addedContact]);
            setShowModal(false);
            setNewContact({ firstName: "", lastName: "", email: "", role: "", phone: "", password: "" });
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    return (
        <div className="p-6">
            {/* 🚀 Geri Butonu */}
            <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-blue-600 hover:underline">
                <FaArrowLeft className="mr-2" /> Back to Customers
            </button>

            {/* 🎯 Sayfa İçeriği - 2 Sütunlu Grid ile Card Yapısı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 🚀 Şirket Adı Card */}
                <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaUserCircle className="text-blue-500" /> {customer.name}
                    </h2>
                    <p className="text-gray-600">{customer.email}</p>
                    <p className="text-gray-600">{customer.phone}</p>
                </div>

                {/* 🚀 Informatie Bölümü */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
                        <FaBuilding /> Informatie
                    </h3>
                    <div className="space-y-3">
                        <p className="flex items-center"><FaMapMarkerAlt className="text-red-500 mr-2" /> <strong>Address:</strong> {customer.address}</p>
                        <p className="flex items-center"><FaGlobe className="text-green-500 mr-2" /> <strong>Postcode:</strong> {customer.postCode}</p>
                        <p className="flex items-center"><FaFlag className="text-yellow-500 mr-2" /> <strong>Country:</strong> {customer.country}</p>
                        <p className="flex items-center"><FaCalendarAlt className="text-red-500 mr-2" /> <strong>Start Date:</strong> {customer.CreatedAt}</p>
                        <p className="flex items-center"><FaGlobe className="text-green-500 mr-2" /> <strong>Website:</strong> {customer.website}</p>
                    </div>
                </div>

                {/* 🚀 Algemeen Bölümü */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
                        <FaClipboardList /> Algemeen
                    </h3>
                    <div className="space-y-3">
                        <p className="flex items-center"><FaCheckCircle className="mr-2 text-green-500" /> <strong>Status:</strong> {customer.status}</p>
                        <p className="flex items-center"><FaHashtag className="text-gray-500 mr-2" /> <strong>BTW Number:</strong> {customer.btwNumber}</p>
                        <p className="flex items-center"><FaBuilding className="text-blue-500 mr-2" /> <strong>KvK Number:</strong> {customer.kvk}</p>
                        <p className="flex items-center"><FaCheckCircle className={`mr-2 ${customer.supplier ? "text-green-500" : "text-red-500"}`} /> <strong>Supplier:</strong> {customer.supplier ? "Yes" : "No"}</p>
                        <p className="flex items-center"><FaFileUpload className="text-gray-500 mr-2" /> <strong>Remarks:</strong> {customer.remarks}</p>
                    </div>
                </div>

                {/* 🚀 Contactpersoon Bölümü */}
                {/* <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
                        <FaUsers /> Contactpersoon
                    </h3>
                    <div className="space-y-3">
                        <p className="flex items-center"><FaUserCircle className="text-blue-500 mr-2" /> <strong>First Name:</strong> {customer.contactFirstName}</p>
                        <p className="flex items-center"><FaUserCircle className="text-blue-500 mr-2" /> <strong>Last Name:</strong> {customer.contactLastName}</p>
                        <p className="flex items-center"><FaEnvelope className="text-red-500 mr-2" /> <strong>Email:</strong> {customer.contactEmail}</p>
                        <p className="flex items-center"><FaPhone className="text-green-500 mr-2" /> <strong>Phone:</strong> {customer.contactPhone}</p>
                    </div>
                </div> */}

            </div>

            {/* 📌 **Contact Persons Tablosu (Eğer Kayıt Varsa Göster) */}
            {/* {contactPersons && contactPersons.length > 0 && ( */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                {/* 📌 Contactpersonen Başlık + Buton */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                        <FaUsers /> Contactpersonen
                    </h3>

                    {/* ➕ Add Contactpersonen Butonu */}
                    <button
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus /> Add Contactpersonen
                    </button>
                </div>


                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="p-3 border"><FaHashtag className="inline-block mr-2" /> ID</th>
                                <th className="p-3 border"><FaUser className="inline-block mr-2" /> Naam</th>
                                <th className="p-3 border"><FaClipboardList className="inline-block mr-2" /> Role</th>
                                <th className="p-3 border"><FaEnvelope className="inline-block mr-2" /> Email</th>
                                <th className="p-3 border"><FaPhone className="inline-block mr-2" /> Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(contactPersons) && contactPersons.map((contact, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="p-3 border">{contact.id}</td>
                                    <td className="p-3 border">{contact.firstName} {contact.lastName}</td>
                                    <td className="p-3 border">{contact.role}</td>
                                    <td className="p-3 border">{contact.email}</td>
                                    <td className="p-3 border">{contact.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* )} */}

            {/* ➕ Add Contact Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
                        {/* ❌ Kapatma Butonu */}
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => setShowModal(false)}
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
                        <input
                            type="text"
                            placeholder="Naam"
                            value={newContact.firstName}
                            onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newContact.email}
                            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                            className="w-full border p-2 rounded mb-3"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={newContact.password}
                            onChange={(e) => setNewContact({ ...newContact, password: e.target.value })}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <select
                            value={newContact.role}
                            onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                            className="w-full border p-2 rounded mb-3"
                        >
                            <option value="">Select Role</option>
                            <option value="Facility">Facility</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Manager">Manager</option>
                        </select>
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded w-full hover:bg-blue-600 transition"
                            onClick={handleAddContact}
                        >
                            Add Contact
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
