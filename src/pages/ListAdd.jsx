import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function ListAdd() {
    const navigate = useNavigate();
    const descriptionInputRef = useRef(null);

    const location = useLocation();
    const initialTicket = location.state?.newTicket || {
        title: "",
        description: "",
        assignedTo: "",
        date: new Date().toLocaleDateString("tr-TR"),
        customer: "",
        building: "",
        files: [],
    };

    // Bildirim Türü Renkleri
    const notificationTypes = {
        Complimenten: "bg-green-300 text-green-800",
        Comentaar: "bg-blue-300 text-blue-800",
        Vraag: "bg-yellow-300 text-yellow-800",
        Klacht: "bg-red-300 text-red-800",
        Melding: "bg-gray-300 text-gray-800",
        "Extra Werk": "bg-purple-300 text-purple-800",
        Ongegrond: "bg-orange-300 text-orange-800",
    };

    const [newTicket, setNewTicket] = useState(initialTicket);
    const [workers, setWorkers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Form gönderim durumu


    // 📌 API’den verileri çek
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workersResponse, customersResponse, buildingsResponse] = await Promise.all([
                    fetch("https://api-osius.up.railway.app/workers"),
                    fetch("https://api-osius.up.railway.app/customers"),
                    fetch("https://api-osius.up.railway.app/buildings"),
                ]);

                if (!workersResponse.ok || !customersResponse.ok || !buildingsResponse.ok) {
                    throw new Error("Failed to fetch data");
                }

                const workersData = await workersResponse.json();
                const customersData = await customersResponse.json();
                const buildingsData = await buildingsResponse.json();

                setWorkers(workersData || []);
                setCustomers(customersData || []);
                setBuildings(buildingsData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching data!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 🏷 **Resim yapıştırma özelliği**
    useEffect(() => {
        const handlePaste = (event) => {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            const newFiles = [];

            for (const item of items) {
                if (item.kind === "file" && item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    const fileURL = URL.createObjectURL(file);
                    newFiles.push({ file, preview: fileURL });
                }
            }

            if (newFiles.length > 0) {
                setNewTicket((prev) => ({
                    ...prev,
                    files: [...(prev.files || []), ...newFiles], // ✅ Doğru kullanım
                }));
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, []);


    // 📎 **Dosya yükleme işlemi**
    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        const newFiles = uploadedFiles.map(file => ({
            file,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null
        }));

        setNewTicket((prev) => ({
            ...prev,
            files: [...(prev.files || []), ...newFiles], // ✅ Hata giderildi
        }));
    };


    // ❌ **Dosya veya resmi silme**
    const removeFile = (index) => {
        setNewTicket((prev) => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index),
        }));
    };

    // ✅ **Yeni Ticket Ekleme**
    const addTicket = async () => {
        if (!newTicket.title || !newTicket.description) {
            toast.error("Title and Description cannot be empty!");
            return;
        }

        setIsSubmitting(true); // 🕓 Form gönderimi başladı

        try {
            // 📌 **Ticket Gönderme**
            const response = await fetch("https://api-osius.up.railway.app/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTicket.title,
                    description: newTicket.description,
                    workerId: newTicket.assignedTo,
                    customerId: newTicket.customer,
                    buildingId: newTicket.building,
                    notificationType: newTicket.notificationType,
                    date: newTicket.date,
                    status: "ToDo", // Varsayılan olarak yeni eklenen ticket "ToDo" olacak
                    creatorId: "1", // ✅ Geçici olarak user ID sabit, ileride dinamik yapılacak
                }),
            });

            if (!response.ok) throw new Error("Failed to create ticket");
            const ticketData = await response.json();

            // 📌 **Dosyaları Gönderme**
            if (newTicket.files && newTicket.files.length > 0) {
                const formData = new FormData();
                newTicket.files.forEach(file => {
                    formData.append("files", file.file);
                });

                const fileUploadRes = await fetch(`https://api-osius.up.railway.app/tickets/${ticketData.id}/files`, {
                    method: "POST",
                    body: formData,
                });

                if (!fileUploadRes.ok) throw new Error("File upload failed");
            }

            toast.success("Ticket added successfully!");
            setTimeout(() => navigate("/dashboard/list"), 1500);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add ticket!");
        } finally {
            setIsSubmitting(false); // ✅ Form işlemi tamamlandı
        }
    };

    return (
        <div className="p-6">
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 mb-4"
                onClick={() => navigate("/dashboard/list")}
            >
                <FaTimes /> Back to List
            </button>

            <h1 className="text-2xl font-bold mb-6">Add New Ticket</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full flex gap-6">
                {loading ? (
                    <p className="text-center text-gray-600 w-full">Loading data...</p>
                ) : (
                    <>
                        {/* 🔹 Sol Taraf */}
                        <div className="w-1/2">
                            <h2 className="text-lg font-semibold mb-4">📋 Ticket Details</h2>

                            <label className="block text-sm font-semibold mt-3">Title</label>
                            <div className="border px-3 py-2 rounded-lg mb-3">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="w-full outline-none"
                                    value={newTicket.title}
                                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                />
                            </div>

                            <label className="block text-sm font-semibold mt-3">Description</label>
                            <div className="border px-3 py-2 rounded-lg mb-3">
                                <textarea
                                    ref={descriptionInputRef}
                                    placeholder="Description"
                                    className="w-full outline-none h-24 resize-none"
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                />
                            </div>

                            <label className="block text-sm font-semibold mt-3">Upload File</label>
                            <input
                                type="file"
                                multiple
                                className="w-full mt-1"
                                onChange={handleFileUpload}
                            />

                            {/* 📌 Yüklenen ve Yapıştırılan Dosyalar */}
                            {newTicket.files?.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold mb-2">Attached Files</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {newTicket.files.map((file, index) => (
                                            <div key={index} className="relative">
                                                {file.preview ? (
                                                    <img
                                                        src={file.preview}
                                                        alt="Preview"
                                                        className="w-24 h-24 object-cover rounded-lg border cursor-pointer"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-lg border">
                                                        <span className="text-xs text-gray-500">{file.file.name}</span>
                                                    </div>
                                                )}
                                                <button
                                                    className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 🔹 Sağ Taraf */}
                        <div className="w-1/2">
                            <h2 className="text-lg font-semibold mb-4">⚙️ Assignments</h2>

                            <label className="block text-sm font-semibold mt-3">Assign to</label>
                            <select className="border px-3 py-2 rounded-lg mb-3 w-full"
                                value={newTicket.assignedTo}
                                onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                            >
                                <option value="">Select a worker</option>
                                {workers.map(worker => (
                                    <option key={worker.id} value={worker.id}>{worker.name}</option>
                                ))}
                            </select>

                            <label className="block text-sm font-semibold mt-3">Customer</label>
                            <select className="border px-3 py-2 rounded-lg mb-3 w-full"
                                value={newTicket.customer || ""}
                                onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                            >
                                <option value="">Select a customer</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>

                            <label className="block text-sm font-semibold mt-3">Location</label>
                            <select className="border px-3 py-2 rounded-lg mb-3 w-full"
                                value={newTicket.building || ""}
                                onChange={(e) => setNewTicket({ ...newTicket, building: e.target.value })}
                            >
                                <option value="">Select a building</option>
                                {buildings.map(building => (
                                    <option key={building.id} value={building.id}>{building.name}</option>
                                ))}
                            </select>

                            {/* 📌 Bildirim Türü Seçimi */}
                            <label className="block text-sm font-semibold mt-3">Notification Type</label>
                            <div className="relative">
                                <select
                                    className={`w-full border rounded px-3 py-2 mt-1 transition-all ${notificationTypes[newTicket.notificationType] || "bg-white text-black"}`}
                                    value={newTicket.notificationType || ""}
                                    onChange={(e) => setNewTicket({ ...newTicket, notificationType: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    {Object.keys(notificationTypes).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </>
                )}
            </div>

            <button onClick={addTicket} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
                {isSubmitting ? "Adding..." : <><FaPlus /> Add Ticket</>}
            </button>
        </div>
    );
}
