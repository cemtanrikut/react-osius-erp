import { useLocation, useNavigate } from "react-router-dom";
import {
    FaUserCircle, FaPhone, FaEnvelope, FaCheckCircle, FaArrowLeft
} from "react-icons/fa";

export default function WorkerDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.worker) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold">Worker not found!</h2>
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => navigate("/dashboard/workers")}
                >
                    Back to Workers
                </button>
            </div>
        );
    }

    const { worker } = state;

    return (
        <div className="p-6">
            {/* 🔙 Geri Butonu */}
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 mb-4"
                onClick={() => navigate("/dashboard/workers")}
            >
                <FaArrowLeft /> Back to Workers
            </button>

            {/* 🏢 Worker Bilgileri */}
            <h1 className="text-2xl font-bold mb-6">{worker.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 👤 Kişisel Bilgiler */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">👤 Personal Information</h2>
                    <p className="flex items-center mb-2">
                        <FaUserCircle className="text-blue-500 mr-2" />
                        <strong>Name:</strong> {worker.name}
                    </p>
                    <p className="flex items-center mb-2">
                        <FaPhone className="text-green-500 mr-2" />
                        <strong>Phone:</strong> {worker.phone}
                    </p>
                    <p className="flex items-center">
                        <FaEnvelope className="text-red-500 mr-2" />
                        <strong>Email:</strong> {worker.email}
                    </p>
                </div>

                {/* 🔵 Durum ve Detaylar */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">🔵 Status</h2>
                    <p className="flex items-center">
                        <FaCheckCircle
                            className={`mr-2 ${worker.status === "Active"
                                    ? "text-green-500"
                                    : worker.status === "Inactive"
                                        ? "text-red-500"
                                        : "text-yellow-500"
                                }`}
                        />
                        <strong>Status:</strong> {worker.status}
                    </p>
                </div>
            </div>
        </div>
    );
}
