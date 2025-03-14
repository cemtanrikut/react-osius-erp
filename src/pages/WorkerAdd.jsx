import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaArrowLeft, FaUserCircle, FaPhone, FaEnvelope, FaLock, FaEnvelopeSquare } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function WorkerAdd() {
    const navigate = useNavigate();
    const [newWorker, setNewWorker] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        status: "Active",
        department: "",
        role: ""
    });

    const addWorker = async () => {
        if (!newWorker.name || !newWorker.phone || !newWorker.email || !newWorker.password || !newWorker.department || !newWorker.role) {
            toast.error("All fields are required!", { position: "top-right" });
            return;
        }

        try {
            const response = await fetch("https://api-osius.up.railway.app/workers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newWorker),
            });

            if (!response.ok) {
                throw new Error("Failed to add worker");
            }

            const data = await response.json();


            toast.success("Worker added successfully!", { position: "top-right" });

            // ✅ Başarıyla eklendiğinde sayfayı yönlendir
            setTimeout(() => {
                navigate("/dashboard/workers");
            }, 1500);

            setNewWorker({ name: "", email: "", phone: "", password: "", status: "Active" });

        } catch (error) {
            console.error("Error adding worker:", error);
            toast.error("Error adding worker. Please try again!", { position: "top-right" });
        }
    };


    return (
        <div className="p-6">
            <Toaster />

            {/* 🔙 Geri Butonu */}
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 mb-4"
                onClick={() => navigate("/dashboard/workers")}
            >
                <FaArrowLeft /> Back to Workers
            </button>

            {/* 🆕 Yeni Worker Ekleme */}
            <h1 className="text-2xl font-bold mb-6">Add Worker</h1>

            {/* 📌 Sayfa İkiye Bölündü */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full flex gap-6">

                {/* 🔹 Sol Taraf - Email & Password */}
                <div className="w-1/2">
                    <h2 className="text-lg font-semibold mb-4">🔐 Login Credentials</h2>

                    {/* Email Input */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaEnvelope className="text-red-500 mr-2" />
                        <input
                            type="email" placeholder="Email" className="w-full outline-none"
                            value={newWorker.email}
                            onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex items-center border px-3 py-2 rounded-lg">
                        <FaLock className="text-gray-600 mr-2" />
                        <input
                            type="password" placeholder="Password" className="w-full outline-none"
                            value={newWorker.password}
                            onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                        />
                    </div>

                    {/* Department Input */}
                    <div className="flex items-center border mt-3 px-3 py-2 rounded-lg">
                        <FaEnvelopeSquare className="text-gray-600 mr-2" />
                        <input
                            type="text" placeholder="Department" className="w-full outline-none"
                            value={newWorker.department}
                            onChange={(e) => setNewWorker({ ...newWorker, department: e.target.value })}
                        />
                    </div>

                    {/* Role Input */}
                    <div className="flex items-center border mt-3 px-3 py-2 rounded-lg">
                        <FaEnvelopeSquare className="text-gray-600 mr-2" />
                        <input
                            type="text" placeholder="Role" className="w-full outline-none"
                            value={newWorker.role}
                            onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                        />
                    </div>
                </div>

                {/* 🔹 Sağ Taraf - Diğer Bilgiler */}
                <div className="w-1/2">
                    <h2 className="text-lg font-semibold mb-4">📝 Personal Details</h2>

                    {/* Full Name Input */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaUserCircle className="text-blue-500 mr-2" />
                        <input
                            type="text" placeholder="Full Name" className="w-full outline-none"
                            value={newWorker.name}
                            onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="flex items-center border px-3 py-2 rounded-lg mb-3">
                        <FaPhone className="text-green-500 mr-2" />
                        <input
                            type="text" placeholder="Phone" className="w-full outline-none"
                            value={newWorker.phone}
                            onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                        />
                    </div>

                    {/* Status Select */}
                    <div className="flex items-center border px-3 py-2 rounded-lg">
                        <FaUserCircle className="text-gray-500 mr-2" />
                        <select
                            className="w-full outline-none bg-transparent"
                            value={newWorker.status}
                            onChange={(e) => setNewWorker({ ...newWorker, status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ✅ Add Worker Butonu */}
            <button
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 flex items-center justify-center gap-2"
                onClick={addWorker}
            >
                <FaPlus /> Add Worker
            </button>
        </div>
    );
}
