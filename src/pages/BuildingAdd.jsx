import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaPlus, FaArrowLeft, FaBuilding, FaLocationArrow, FaHome,
    FaHashtag, FaMapMarkerAlt, FaStickyNote, FaCheckCircle, FaCalculator
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function BuildingAdd() {
    const navigate = useNavigate();
    const [newBuilding, setNewBuilding] = useState({
        name: "", address: "", houseNo: "", postCode: "", plaats: "",
        status: "Active", note: "", calculateType: "Fixed"
    });

    const addBuilding = async () => {
        console.log("🛜 Butona tıklandı, fetch fonksiyonu çalışıyor..."); // 🛠 Debug log

        if (!newBuilding.name || !newBuilding.address || !newBuilding.houseNo || !newBuilding.postCode || !newBuilding.plaats || !newBuilding.status || !newBuilding.note || !newBuilding.calculateType) {
            toast.error("All fields are required!", { position: "top-right" });
            console.log("❌ Eksik alan var, fetch çağrısı yapılmayacak.");
            return;
        }

        try {
            console.log("🚀 Backend'e istek gönderiliyor...");
            const response = await fetch("https://api-osius.up.railway.app/buildings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBuilding),
            });

            console.log("📌 API isteği yapıldı, response bekleniyor...");

            if (!response.ok) {
                throw new Error("Failed to add building");
            }

            const data = await response.json();
            console.log("✅ API Yanıtı Alındı:", data);

            toast.success("Building added successfully!", { position: "top-right" });

            setTimeout(() => {
                navigate("/dashboard/buildings");
            }, 1500);

        } catch (error) {
            console.error("❌ Fetch hatası:", error);
            toast.error("Error adding building. Please try again!", { position: "top-right" });
        }
    };


    //   const addBuilding = () => {
    //     if (!newBuilding.name || !newBuilding.address || !newBuilding.houseNo || !newBuilding.postCode || !newBuilding.plaats) {
    //       toast.error("All fields are required!", { position: "top-right" });
    //       return;
    //     }

    //     toast.success("Building added successfully!", { position: "top-right" });

    //     // ✅ Building eklendikten sonra Buildings sayfasına yönlendir
    //     setTimeout(() => {
    //       navigate("/dashboard/buildings");
    //     }, 1500); // 1.5 saniye bekletme, kullanıcı mesajı görebilsin
    //   };

    return (
        <div className="p-6">
            <Toaster />

            {/* 🔙 Geri Butonu */}
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 mb-4"
                onClick={() => navigate("/dashboard/buildings")}
            >
                <FaArrowLeft /> Back to Buildings
            </button>

            {/* 🆕 Yeni Building Ekleme */}
            <h1 className="text-2xl font-bold mb-6">Add Building</h1>

            {/* 📌 Sayfa İkiye Bölündü */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full flex gap-6">

                {/* 🔹 Sol Taraf - Adres Bilgileri */}
                <div className="w-1/2">
                    <h2 className="text-lg font-semibold mb-4">📍 Address Information</h2>

                    {/* Building Name */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaBuilding className="text-blue-500 mr-2" />
                        <input
                            type="text" placeholder="Building Name" className="w-full outline-none"
                            value={newBuilding.name}
                            onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                        />
                    </div>

                    {/* Address */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaLocationArrow className="text-green-500 mr-2" />
                        <input
                            type="text" placeholder="Address" className="w-full outline-none"
                            value={newBuilding.address}
                            onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                        />
                    </div>

                    {/* House No */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaHome className="text-purple-500 mr-2" />
                        <input
                            type="text" placeholder="House No." className="w-full outline-none"
                            value={newBuilding.houseNo}
                            onChange={(e) => setNewBuilding({ ...newBuilding, houseNo: e.target.value })}
                        />
                    </div>

                    {/* Post Code */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaHashtag className="text-orange-500 mr-2" />
                        <input
                            type="text" placeholder="Post Code" className="w-full outline-none"
                            value={newBuilding.postCode}
                            onChange={(e) => setNewBuilding({ ...newBuilding, postCode: e.target.value })}
                        />
                    </div>

                    {/* Plaats */}
                    <div className="flex items-center border px-3 py-2 rounded-lg">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        <input
                            type="text" placeholder="Plaats" className="w-full outline-none"
                            value={newBuilding.plaats}
                            onChange={(e) => setNewBuilding({ ...newBuilding, plaats: e.target.value })}
                        />
                    </div>
                </div>

                {/* 🔹 Sağ Taraf - Genel Bilgiler */}
                <div className="w-1/2">
                    <h2 className="text-lg font-semibold mb-4">⚙️ General Information</h2>

                    {/* Status */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
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

                    {/* Note */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaStickyNote className="text-gray-500 mr-2" />
                        <input
                            type="text" placeholder="Note" className="w-full outline-none"
                            value={newBuilding.note}
                            onChange={(e) => setNewBuilding({ ...newBuilding, note: e.target.value })}
                        />
                    </div>

                    {/* Calculate Type */}
                    <div className="flex items-center border px-3 py-2 rounded-lg">
                        <FaCalculator className="text-indigo-500 mr-2" />
                        <select
                            className="w-full outline-none bg-transparent"
                            value={newBuilding.calculateType}
                            onChange={(e) => setNewBuilding({ ...newBuilding, calculateType: e.target.value })}
                        >
                            <option value="Fixed">Fixed</option>
                            <option value="Variable">Variable</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ✅ Add Building Butonu */}
            <button
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 flex items-center justify-center gap-2"
                onClick={addBuilding}
            >
                <FaPlus /> Add Building
            </button>
        </div>
    );
}
