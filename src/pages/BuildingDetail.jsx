import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    FaBuilding, FaLocationArrow, FaMapMarkerAlt, FaHashtag,
    FaStickyNote, FaCalculator, FaCheckCircle, FaArrowLeft
} from "react-icons/fa";

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

    // Eğer state varsa kullan, yoksa ID'ye göre building'i bul
    const building = location.state?.building || buildingData.find((b) => b.id === id);

    if (!building) {
        return <div className="p-6">Building not found.</div>;
    }

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
        </div>
    );
}
