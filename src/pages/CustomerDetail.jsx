import { useLocation, useParams, useNavigate } from "react-router-dom";
import { 
  FaUserCircle, FaPhone, FaEnvelope, FaArrowLeft, FaMapMarkerAlt, 
  FaGlobe, FaFlag, FaCalendarAlt, FaCheckCircle, FaBuilding, FaClipboardList, 
  FaUsers, FaHashtag, FaFileUpload
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
    contactFirstName: "John",
    contactLastName: "Doe",
    contactEmail: "john.doe@philips.com",
    contactPhone: "+31 6 87654321"
  }
];

export default function CustomerDetail() {
  const { id } = useParams(); // URL'deki ID'yi alıyoruz
  const location = useLocation(); // React Router ile state'i alıyoruz
  const navigate = useNavigate();

  // Eğer state varsa kullan, yoksa ID'ye göre müşteriyi bul
  const customer = location.state?.customer || customerData.find((c) => c.id === id);

  if (!customer) {
    return <div className="p-6">Customer not found.</div>;
  }

  return (
    <div className="p-6">
      {/* 🚀 Geri Butonu */}
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-blue-600 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Customers
      </button>

      {/* 🎯 Sayfa İçeriği - 3 Sütunlu Grid ile Card Yapısı */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 🚀 Şirket Adı Card */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-3">
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
            <p className="flex items-center"><FaGlobe className="text-green-500 mr-2" /> <strong>Postcode:</strong> {customer.postcode}</p>
            <p className="flex items-center"><FaFlag className="text-yellow-500 mr-2" /> <strong>Country:</strong> {customer.country}</p>
            <p className="flex items-center"><FaCalendarAlt className="text-red-500 mr-2" /> <strong>Start Date:</strong> {customer.startDate}</p>
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
            <p className="flex items-center"><FaBuilding className="text-blue-500 mr-2" /> <strong>KvK Number:</strong> {customer.kvkNumber}</p>
            <p className="flex items-center"><FaHashtag className="text-gray-500 mr-2" /> <strong>OIN:</strong> {customer.oin}</p>
            <p className="flex items-center"><FaCheckCircle className={`mr-2 ${customer.supplier ? "text-green-500" : "text-red-500"}`} /> <strong>Supplier:</strong> {customer.supplier ? "Yes" : "No"}</p>
            <p className="flex items-center"><FaFileUpload className="text-gray-500 mr-2" /> <strong>Remarks:</strong> {customer.remarks}</p>
          </div>
        </div>

        {/* 🚀 Contactpersoon Bölümü */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
            <FaUsers /> Contactpersoon
          </h3>
          <div className="space-y-3">
            <p className="flex items-center"><FaUserCircle className="text-blue-500 mr-2" /> <strong>First Name:</strong> {customer.contactFirstName}</p>
            <p className="flex items-center"><FaUserCircle className="text-blue-500 mr-2" /> <strong>Last Name:</strong> {customer.contactLastName}</p>
            <p className="flex items-center"><FaEnvelope className="text-red-500 mr-2" /> <strong>Email:</strong> {customer.contactEmail}</p>
            <p className="flex items-center"><FaPhone className="text-green-500 mr-2" /> <strong>Phone:</strong> {customer.contactPhone}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
