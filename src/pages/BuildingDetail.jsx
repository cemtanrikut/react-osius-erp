import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    FaBuilding, FaLocationArrow, FaMapMarkerAlt, FaHashtag,
    FaStickyNote, FaCalculator, FaCheckCircle, FaArrowLeft,
    FaClipboardList,
    FaEnvelope,
    FaPhone,
    FaPlus,
    FaTimes,
    FaUser,
    FaUsers
} from "react-icons/fa";
import { useState, useEffect } from "react";

// Örnek Building Verisi (Gerçek veriyi API veya state'ten alabilirsin)
const buildingData = [
    {
        id: "B-1",
        name: "Rijksmuseum",
        address: "Museumstraat 1",
        houseNo: "1",
        postCode: "1071 XX",
        plaats: "Amsterdam",
        status: "Active",
        note: "Historic building with a lot of visitors",
        calculateType: "Fixed"
    }
];

export default function BuildingDetail() {
    const { id } = useParams(); // URL'deki ID'yi alıyoruz
    const location = useLocation(); // React Router ile state'i alıyoruz
    const navigate = useNavigate();

    const [contactPersons, setContactPersons] = useState([]);

    const [showModal, setShowModal] = useState(false);

    // Eğer state varsa kullan, yoksa ID'ye göre building'i bul
    const building = location.state?.building || buildingData.find((b) => b.id === id);

    if (!building) {
        return <div className="p-6">Building not found.</div>;
    }

    const [newContact, setNewContact] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        phone: "",
        password: "",
    });

    useEffect(() => {
        const API_URL = window.location.hostname === "localhost"
            ? "http://localhost:8080"
            : "https://api-osius.up.railway.app";

        console.log("Fetching contacts for customer:", id);

        fetch(`https://api-osius.up.railway.app/contacts/building/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched contact persons:", data);

                console.log("Current buildingId:", id);
                console.log("Fetched contactPersons:", contactPersons);

                setContactPersons(data);

                // 🔥 Güncellenmiş state'i hemen görmek için:
                setTimeout(() => {
                    console.log("Updated contactPersons state:", contactPersons);
                }, 1000); // 1 saniye bekleyerek state’in değiştiğini görebiliriz
            })
            .catch((error) => console.error("Contact persons fetch error:", error));
    }, [id]);

    const handleAddContact = async () => {
        if (!newContact.firstName || !newContact.email || !newContact.role || !newContact.phone) {
            alert("All fields are required.");
            return;
        }

        const contactData = {
            ...newContact,
            customerId: "",
            buildingId: id, // Eğer BuildingID eklemek istersen buraya ekle
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
                <FaArrowLeft className="mr-2" /> Back to Buildings
            </button>

            {/* 🎯 Sayfa İçeriği - 3 Sütunlu Grid ile Card Yapısı */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 🚀 Bina Adı Card */}
                <div className="bg-white p-6 rounded-lg shadow-md col-span-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaBuilding className="text-blue-500" /> {building.name}
                    </h2>
                    <p className="text-gray-600">{building.address}, {building.plaats}</p>
                </div>

                {/* 🚀 Adres Bilgileri */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
                        <FaLocationArrow /> Address Information
                    </h3>
                    <div className="space-y-3">
                        <p className="flex items-center"><FaLocationArrow className="text-green-500 mr-2" /> <strong>Address:</strong> {building.address}</p>
                        <p className="flex items-center"><FaHashtag className="text-orange-500 mr-2" /> <strong>House No:</strong> {building.houseNo}</p>
                        <p className="flex items-center"><FaHashtag className="text-gray-500 mr-2" /> <strong>Post Code:</strong> {building.postCode}</p>
                        <p className="flex items-center"><FaMapMarkerAlt className="text-red-500 mr-2" /> <strong>Plaats:</strong> {building.plaats}</p>
                    </div>
                </div>

                {/* 🚀 Durum & Notlar */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
                        <FaCheckCircle /> Status & Notes
                    </h3>
                    <div className="space-y-3">
                        <p className="flex items-center">
                            <FaCheckCircle
                                className={`mr-2 ${building.status === "Active" ? "text-green-500"
                                    : building.status === "Inactive" ? "text-red-500"
                                        : "text-yellow-500"
                                    }`}
                            />
                            <strong>Status:</strong> {building.status}
                        </p>
                        <p className="flex items-center"><FaStickyNote className="text-gray-500 mr-2" /> <strong>Note:</strong> {building.note}</p>
                    </div>
                </div>

                {/* 🚀 Hesaplama Tipi */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
                        <FaCalculator /> Calculation Type
                    </h3>
                    <div className="space-y-3">
                        <p className="flex items-center"><FaCalculator className="text-indigo-500 mr-2" /> <strong>Calculate Type:</strong> {building.calculateType}</p>
                    </div>
                </div>

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
