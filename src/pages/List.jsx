import { useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaHashtag, FaPlus, FaTimes, FaFileUpload, FaPaperclip, FaRegSmile, FaPaperPlane, FaFilter, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

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

// Rastgele atanacak kişiler ve konumlar
const users = ["Cem Tanrikut", "Ramazan", "Abdullah Soyaslan", "Jony Ive"];
const locations = ["Amsterdam", "Rotterdam", "Utrecht", "The Hague", "Eindhoven", "Groningen"];
const locations1 = {
    Amsterdam: "Amsterdam",
    Rotterdam: "Rotterdam",
    Utrecht: "Utrecht",
    "The Hague": "The Hague",
    Eindhoven: "Eindhoven",
    Groningen: "Groningen"
};


const initialTicketData = {
    todo: [
        { id: "1", code: "T-001", title: "Design Login Page", description: "Create a login page UI", assignedTo: "Cem Tanrikut", date: "28-02-2025", location: "Amsterdam", type: "Vraag", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
        { id: "2", code: "T-002", title: "Fix Authentication Bug", description: "Debug login issues", assignedTo: "Ramazan", date: "28-02-2025", location: "Rotterdam", type: "Klacht", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
        { id: "3", code: "T-003", title: "Setup Database", description: "Configure MongoDB instance", assignedTo: "Abdullah Soyaslan", date: "27-02-2025", location: "Utrecht", type: "Melding", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
    ],
    inProgress: [
        { id: "4", code: "T-004", title: "API Integration", description: "Connect frontend with backend", assignedTo: "Cem Tanrikut", date: "27-02-2025", location: "The Hague", type: "Extra Werk", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
        { id: "5", code: "T-005", title: "Dashboard Charts", description: "Implement analytics dashboard", assignedTo: "Jony Ive", date: "26-02-2025", location: "Eindhoven", type: "Complimenten", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
        { id: "6", code: "T-006", title: "Refactor Codebase", description: "Optimize component structure", assignedTo: "Ramazan", date: "25-02-2025", location: "Groningen", type: "Ongegrond", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
    ],
    done: [
        { id: "7", code: "T-007", title: "Create UI Mockups", description: "Design wireframes for app", assignedTo: "Abdullah Soyaslan", date: "24-02-2025", location: "Haarlem", type: "Vraag", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
        { id: "8", code: "T-008", title: "Implement Dark Mode", description: "Add theme switching", assignedTo: "Cem Tanrikut", date: "23-02-2025", location: "Leiden", type: "Complimenten", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
        { id: "9", code: "T-009", title: "Optimize Queries", description: "Improve database performance", assignedTo: "Jony Ive", date: "22-02-2025", location: "Maastricht", type: "Comentaar", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
        { id: "10", code: "T-010", title: "Deploy to Production", description: "Push latest release", assignedTo: "Abdullah Soyaslan", date: "21-02-2025", location: "Delft", type: "Melding", createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu" },
    ],
};

export default function List() {
    const [activeTab, setActiveTab] = useState("todo");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketData, setTicketData] = useState(initialTicketData);
    const lastToastId = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState({}); // Her ticket için mesajları saklar
    const [newMessage, setNewMessage] = useState("");
    const [filterAssignedTo, setFilterAssignedTo] = useState("");
    const [filterBuilding, setFilteredBuilding] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [newTicket, setNewTicket] = useState({
        title: "",
        description: "",
        assignedTo: users[0],
        date: new Date().toLocaleDateString("tr-TR"), // Bugünün tarihi
        location: locations[0],
        file: null,
    });
    // 🏷 Yeni eklenen state (Büyük resim önizleme için)
    const [previewImage, setPreviewImage] = useState(null);
    // ❌ **Delete Confirmation Modal için State**
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    // ✏️ Update Modal için State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [ticketToUpdate, setTicketToUpdate] = useState(null);

    // ✏️ **Update Modal'ı Aç**
    const openUpdateModal = (ticket) => {
        setTicketToUpdate(ticket);
        setIsUpdateModalOpen(true);
    };

    // ❌ **Delete Modal'ı Aç**
    const openDeleteModal = (ticket) => {
        setTicketToDelete(ticket);
        setIsDeleteModalOpen(true);
    };


    // Modal aç/kapa
    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    const formatDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Yeni ticket ekleme
    const addTicket = () => {
        if (!newTicket.title || !newTicket.description) {
            toast.error("Title and Description area should be filled!", { position: "top-right" });
            return;
        }

        const newId = `T-${ticketData.todo.length + ticketData.inProgress.length + ticketData.done.length + 1}`;
        const ticket = { id: newId, code: newId, createdBy: "Cem Tanrikut", customer: "Ramazan Ugurlu", ...newTicket };

        setTicketData((prev) => ({
            ...prev,
            todo: [ticket, ...prev.todo], // Yeni ticket'ı listenin başına ekliyoruz
        }));

        toast.success("Ticket başarıyla eklendi!", { position: "top-right" });
        setNewTicket({
            title: "",
            description: "",
            assignedTo: users[0],
            date: formatDate,
            location: locations[0],
            file: null,
            createdBy: "Cem Tanrikut",
            customer: "Ramazan Ugurlu",
        });
        closeModal();
    };

    const moveTicket = (ticket, from, to) => {
        setTicketData((prev) => {
            const updatedFrom = prev[from].filter((t) => t.id !== ticket.id);
            const updatedTo = [...prev[to], ticket];

            // Aynı ticket için tekrar toast göstermeyi engelle
            if (lastToastId.current !== ticket.id) {
                toast.success(`${ticket.title} moved to ${to === "todo" ? "To Do" : to === "inProgress" ? "In Progress" : "Done"}!`, {
                    duration: 3000,
                    position: "top-right",
                });
                lastToastId.current = ticket.id;
            }

            return {
                ...prev,
                [from]: updatedFrom,
                [to]: updatedTo,
            };
        });

        setSelectedTicket(null);
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        setMessages((prev) => ({
            ...prev,
            [selectedTicket.id]: [...(prev[selectedTicket.id] || []), { text: newMessage, sender: "You", time: new Date().toLocaleTimeString() }],
        }));
        setNewMessage("");
    };

    // Dosya seçme için ref
    const fileInputRef = useRef(null);
    // Dosya seçildiğinde çağrılacak fonksiyon
    //   const handleFileUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //       setMessages((prev) => ({
    //         ...prev,
    //         [selectedTicket.id]: [
    //           ...(prev[selectedTicket.id] || []),
    //           {
    //             text: `📎 ${file.name} (${file.type || "Unknown Type"})`,
    //             sender: "You",
    //             time: new Date().toLocaleTimeString(),
    //           },
    //         ],
    //       }));
    //     }
    //   }; 

    // 📎 Dosya gönderme ve önizleme
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            const fileType = file.type.startsWith("image/") ? "image" : "file"; // Resim mi, yoksa başka dosya mı?

            setMessages((prev) => ({
                ...prev,
                [selectedTicket.id]: [
                    ...(prev[selectedTicket.id] || []),
                    {
                        text: file.name,
                        sender: "You",
                        time: new Date().toLocaleTimeString(),
                        fileType,
                        fileURL,
                    },
                ],
            }));
        }
    };


    // Filtreleme fonksiyonu
    const filteredTickets = ticketData[activeTab].filter(ticket =>
        (filterAssignedTo ? ticket.assignedTo === filterAssignedTo : true) &&
        (filterCategory ? ticket.type === filterCategory : true) &&
        (filterBuilding ? ticket.location === filterBuilding : true)
    );

    // ✅ **Ticket Güncelleme Fonksiyonu**
    const updateTicket = () => {
        if (!ticketToUpdate.title || !ticketToUpdate.description) {
            toast.error("Title and Description cannot be empty!", { position: "top-right" });
            return;
        }

        setTicketData((prev) => ({
            ...prev,
            [activeTab]: prev[activeTab].map((t) => (t.id === ticketToUpdate.id ? ticketToUpdate : t)),
        }));

        // 🎯 **Seçili ticket'ı güncelle!**
        setSelectedTicket(ticketToUpdate); // ✅ Detayın da güncellenmesini sağlıyor

        setIsUpdateModalOpen(false);
        toast.success("Ticket updated successfully!", { position: "top-right" });
    };

    // ✅ **Ticket Silme Fonksiyonu**
    const confirmDeleteTicket = () => {
        if (!ticketToDelete) return;

        setTicketData((prev) => ({
            ...prev,
            [activeTab]: prev[activeTab].filter((t) => t.id !== ticketToDelete.id),
        }));

        setSelectedTicket(null);
        setIsDeleteModalOpen(false);
        toast.success("Ticket deleted successfully!", { position: "top-right" });
    };


    const descriptionInputRef = useRef(null);
    const messageInputRef = useRef(null);

    // Resim cmd v
    useEffect(() => {
        const handlePaste = (event) => {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (const item of items) {
                if (item.kind === "file" && item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    const fileURL = URL.createObjectURL(file);

                    // 🏷 Eğer "Add Ticket" modalı açıksa ve description alanı focus'taysa
                    if (isModalOpen && document.activeElement === descriptionInputRef.current) {
                        setNewTicket((prev) => ({
                            ...prev,
                            description: prev.description + "\n[Attached Image]",
                            attachedImage: fileURL, // Yeni eklenen alan, resmi tutacak
                        }));
                    }
                    // 🏷 Eğer mesaj yazma alanı focus'taysa
                    else if (selectedTicket && document.activeElement === messageInputRef.current) {
                        setMessages((prev) => ({
                            ...prev,
                            [selectedTicket.id]: [
                                ...(prev[selectedTicket.id] || []),
                                {
                                    text: "Pasted Image",
                                    sender: "You",
                                    time: new Date().toLocaleTimeString(),
                                    fileType: "image",
                                    fileURL,
                                },
                            ],
                        }));
                    }
                }
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [selectedTicket, isModalOpen]);


    return (
        <div className="p-4 flex flex-col h-screen">
            <Toaster /> {/* Toast gösterici */}
            <h1 className="text-2xl font-bold mb-6">Meldingen</h1>
            {/* Üst Sekmeler ve "+ Add Ticket" Butonu */}
            <div className="flex justify-between items-center mb-4">
                {/* Sekmeler */}
                <div className="flex gap-4">
                    {["todo", "inProgress", "done"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setSelectedTicket(null);
                            }}
                            className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${activeTab === tab
                                    ? tab === "todo"
                                        ? "bg-blue-500"
                                        : tab === "inProgress"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                    : "bg-gray-400 hover:bg-gray-500"
                                }`}
                        >
                            {tab === "todo" && "To Do"}
                            {tab === "inProgress" && "In Progress"}
                            {tab === "done" && "Done"}
                        </button>
                    ))}
                </div>

                {/* 🎯 Filtreleme Alanı */}
                <div className="bg-white shadow-md rounded-lg p-3 mb-0 flex gap-4 items-center">
                    <FaFilter className="text-gray-600" />
                    <select className="border px-3 py-2 rounded-lg" value={filterAssignedTo} onChange={e => setFilterAssignedTo(e.target.value)}>
                        <option value="">Filter by Assignee</option>
                        {users.map(user => <option key={user} value={user}>{user}</option>)}
                    </select>
                    <select className="border px-3 py-2 rounded-lg" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">Filter by Category</option>
                        {Object.keys(notificationTypes).map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <select className="border px-3 py-2 rounded-lg" value={filterAssignedTo} onChange={e => setFilterAssignedTo(e.target.value)}>
                        <option value="">Filter by Customer</option>
                        {users.map(user => <option key={user} value={user}>{user}</option>)}
                    </select>
                    <select className="border px-3 py-2 rounded-lg" value={filterBuilding} onChange={e => setFilteredBuilding(e.target.value)}>
                        <option value="">Filter by Building</option>
                        {Object.keys(locations1).map(location => <option key={location} value={location}>{location}</option>)}
                    </select>
                    <button className="bg-gray-500 text-white px-3 py-2 rounded-lg" onClick={() => { setFilterAssignedTo(""); setFilterCategory(""); setFilteredBuilding(""); }}>Clear</button>
                </div>

                {/* "+ Add Ticket" Butonu */}
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition-all"
                >
                    <FaPlus />
                    Add Ticket
                </button>
            </div>


            {/* Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center">
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center">
                                <Dialog.Title className="text-xl font-semibold">Add New Ticket</Dialog.Title>
                                <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {/* Sol Alan */}
                                <div>
                                    <label className="block text-sm font-semibold">Title</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        value={newTicket.title}
                                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                    />

                                    <label className="block text-sm font-semibold mt-3">Description</label>
                                    <textarea
                                        ref={descriptionInputRef}
                                        className="w-full border rounded px-3 py-2 mt-1 h-62 resize-none"
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    ></textarea>


                                </div>

                                {/* Sağ Alan */}
                                <div>
                                    <label className="block text-sm font-semibold mt-3">Assigned To</label>
                                    <select
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        value={newTicket.assignedTo}
                                        onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                                    >
                                        {users.map((user) => (
                                            <option key={user} value={user}>
                                                {user}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="block text-sm font-semibold mt-3">Category</label>
                                    <select
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        value={newTicket.category || ""}
                                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Complimenten">Complimenten</option>
                                        <option value="Comentaar">Comentaar</option>
                                        <option value="Vraag">Vraag</option>
                                        <option value="Klacht">Klacht</option>
                                        <option value="Melding">Melding</option>
                                        <option value="Extra Werk">Extra Werk</option>
                                        <option value="Ongegrond">Ongegrond</option>
                                    </select>
                                    <label className="block text-sm font-semibold">Date</label>
                                    <input type="text" className="w-full border rounded px-3 py-2 mt-1 bg-gray-100" value={newTicket.date} disabled />

                                    <label className="block text-sm font-semibold mt-3">Upload File</label>
                                    <input
                                        type="file"
                                        className="w-full mt-1"
                                        onChange={(e) => setNewTicket({ ...newTicket, file: e.target.files[0] })}
                                    />

                                    <label className="block text-sm font-semibold mt-3">Location</label>
                                    <select
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        value={newTicket.location}
                                        onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
                                    >
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Eğer resim varsa Thumbnail Göster + "X" Butonu */}
                                    {newTicket.attachedImage && (
                                        <div className="relative mt-6 flex justify-center">
                                            <img
                                                src={newTicket.attachedImage}
                                                alt="Attached"
                                                className="w-32 h-auto rounded-lg cursor-pointer hover:opacity-80 border"
                                                onClick={() => setPreviewImage(newTicket.attachedImage)}
                                            />
                                            {/* ❌ X Butonu (Resmi Silmek için) */}
                                            <button
                                                className="absolute top-[-10px] right-[60px] bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                onClick={() => setNewTicket({ ...newTicket, attachedImage: null })}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button onClick={addTicket} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
                                Add Ticket
                            </button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>



            {/* İçerik Alanı (Sol + Sağ) */}
            <div className="flex flex-grow bg-white shadow-lg rounded-lg overflow-hidden h-full mb-13">

                {/* Sol: Ticket Listesi */}
                <div className="w-1/3 bg-gray-50 overflow-y-auto h-full p-4">
                    {ticketData[activeTab]
                        .filter((ticket) => !filterAssignedTo || ticket.assignedTo === filterAssignedTo)
                        .filter((ticket) => !filterBuilding || ticket.building === filterBuilding)
                        .filter((ticket) => !filterCategory || ticket.type === filterCategory)
                        .map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 mb-2 rounded-lg cursor-pointer shadow-md transition-all ${selectedTicket?.id === ticket.id ? "bg-blue-100 border-l-4 border-blue-500" : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                {/* Ticket ID */}
                                <div className="flex items-center text-gray-500 text-xs mb-2">
                                    <FaHashtag className="mr-2 text-gray-400" />
                                    <span className="font-bold">{ticket.code}</span>
                                </div>

                                {/* Ticket Başlığı */}
                                <h3 className="text-md font-bold">{ticket.title}</h3>

                                {/* Açıklama */}
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>

                                {/* Konum, Kişi ve Tarih */}
                                <div className="flex justify-between text-gray-600 text-xs mt-4">
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="mr-1 text-green-500" />
                                        <span>{ticket.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaUser className="mr-1 text-blue-500" />
                                        <span>Customer: {ticket.assignedTo}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-1 text-red-500" />
                                        <span>{ticket.date}</span>
                                    </div>
                                </div>
                                {/* Assigned To */}
                                <p className="text-gray-500 mt-2 flex items-center text-xs">
                                    <FaUser className="mr-2 text-blue-500" />
                                    <span className="font-semibold">Assigned to: </span> {ticket.assignedTo}
                                </p>
                                {/* Created By */}
                                <p className="text-gray-500 mt-2 flex items-center text-xs">
                                    <FaUser className="mr-2 text-gray-500" />
                                    <span className="font-semibold">Created by: </span> {ticket.createdBy}
                                </p>



                                {/* Bildirim Türü */}
                                <div className={`mt-3 text-xs font-semibold px-3 py-1 rounded-full inline-block ${notificationTypes[ticket.type]}`}>
                                    {ticket.type}
                                </div>

                            </div>
                        ))}
                </div>

                {/* Sağ: Ticket Detayı + Mesajlar */}
                <div className="w-2/3 p-6 flex flex-col h-full">
                    {selectedTicket ? (
                        <>
                            <div>
                                {/* Ticket ID */}
                                <div className="flex items-center text-gray-500 text-sm mb-2">
                                    <FaHashtag className="mr-2 text-gray-400" />
                                    <span className="font-bold">{selectedTicket.code}</span>
                                </div>
                                {/* Taşıma Butonları */}
                                <div className="flex items-center justify-between">
                                    {/* Ticket Başlığı */}
                                    <h2 className="text-xl font-bold">{selectedTicket.title}</h2>

                                    {/* Butonlar */}
                                    <div className="flex gap-2">
                                        {activeTab === "todo" && (
                                            <button
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                                onClick={() => moveTicket(selectedTicket, "todo", "inProgress")}
                                            >
                                                Move to In Progress
                                            </button>
                                        )}
                                        {activeTab === "inProgress" && (
                                            <>
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                                    onClick={() => moveTicket(selectedTicket, "inProgress", "todo")}
                                                >
                                                    Move to To Do
                                                </button>
                                                <button
                                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                                    onClick={() => moveTicket(selectedTicket, "inProgress", "done")}
                                                >
                                                    Move to Done
                                                </button>
                                            </>
                                        )}
                                        {activeTab === "done" && (
                                            <button
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                                onClick={() => moveTicket(selectedTicket, "done", "inProgress")}
                                            >
                                                Move to In Progress
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* 🎯 Update ve Delete Butonları */}
                                <div className="flex gap-3 mt-3">
                                    <button
                                        className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600"
                                        onClick={() => openUpdateModal(selectedTicket)}
                                    >
                                        Update
                                    </button>

                                    {/* 🎯 **Update Ticket Modal** */}
                                    <Transition appear show={isUpdateModalOpen} as={Fragment}>
                                        <Dialog as="div" className="relative z-10" onClose={() => setIsUpdateModalOpen(false)}>
                                            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                                <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-96">
                                                    <div className="flex justify-between items-center">
                                                        <Dialog.Title className="text-xl font-semibold">Update Ticket</Dialog.Title>
                                                        <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-500 hover:text-red-500">
                                                            <FaTimes />
                                                        </button>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="block text-sm font-semibold">Title</label>
                                                        <input
                                                            type="text"
                                                            className="w-full border rounded px-3 py-2 mt-1"
                                                            value={ticketToUpdate?.title || ""}
                                                            onChange={(e) => setTicketToUpdate({ ...ticketToUpdate, title: e.target.value })}
                                                        />

                                                        <label className="block text-sm font-semibold mt-3">Description</label>
                                                        <textarea
                                                            className="w-full border rounded px-3 py-2 mt-1"
                                                            rows="3"
                                                            value={ticketToUpdate?.description || ""}
                                                            onChange={(e) => setTicketToUpdate({ ...ticketToUpdate, description: e.target.value })}
                                                        ></textarea>

                                                        <label className="block text-sm font-semibold mt-3">Assigned To</label>
                                                        <select
                                                            className="w-full border rounded px-3 py-2 mt-1"
                                                            value={ticketToUpdate?.assignedTo || ""}
                                                            onChange={(e) => setTicketToUpdate({ ...ticketToUpdate, assignedTo: e.target.value })}
                                                        >
                                                            {users.map((user) => (
                                                                <option key={user} value={user}>
                                                                    {user}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* 🎯 **Kategori Güncelleme Alanı** */}
                                                        <label className="block text-sm font-semibold mt-3">Category</label>
                                                        <select
                                                            className="w-full border rounded px-3 py-2 mt-1"
                                                            value={ticketToUpdate?.type || ""}
                                                            onChange={(e) => setTicketToUpdate({ ...ticketToUpdate, type: e.target.value })}
                                                        >
                                                            {Object.keys(notificationTypes).map((category) => (
                                                                <option key={category} value={category}>
                                                                    {category}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <label className="block text-sm font-semibold mt-3">Date</label>
                                                        <input type="text" className="w-full border rounded px-3 py-2 mt-1 bg-gray-100" value={ticketToUpdate?.date} disabled />

                                                        <label className="block text-sm font-semibold mt-3">Location</label>
                                                        <select
                                                            className="w-full border rounded px-3 py-2 mt-1"
                                                            value={ticketToUpdate?.location || ""}
                                                            onChange={(e) => setTicketToUpdate({ ...ticketToUpdate, location: e.target.value })}
                                                        >
                                                            {locations.map((loc) => (
                                                                <option key={loc} value={loc}>
                                                                    {loc}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <button onClick={updateTicket} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
                                                            Update Ticket
                                                        </button>
                                                    </div>
                                                </Dialog.Panel>
                                            </div>
                                        </Dialog>
                                    </Transition>

                                    <button
                                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                                        onClick={() => openDeleteModal(selectedTicket)}
                                    >
                                        Delete
                                    </button>
                                    {/* ❌ **Delete Confirmation Modal** */}
                                    <Transition appear show={isDeleteModalOpen} as={Fragment}>
                                        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
                                            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                                <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-96">
                                                    <div className="flex items-center text-red-500">
                                                        <FaExclamationTriangle className="text-3xl mr-3" />
                                                        <Dialog.Title className="text-xl font-semibold">Are you sure?</Dialog.Title>
                                                    </div>
                                                    <p className="text-gray-600 mt-3">
                                                        Do you really want to delete this ticket? This action cannot be undone.
                                                    </p>

                                                    <div className="flex justify-end gap-3 mt-5">
                                                        <button className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600" onClick={() => setIsDeleteModalOpen(false)}>
                                                            No
                                                        </button>
                                                        <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600" onClick={confirmDeleteTicket}>
                                                            Yes, Delete
                                                        </button>
                                                    </div>
                                                </Dialog.Panel>
                                            </div>
                                        </Dialog>
                                    </Transition>



                                </div>


                                {/* Atanan Kişi */}
                                {/* <p className="text-gray-500 mt-2 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                {selectedTicket.assignedTo}
                </p> */}

                                {/* Konum */}
                                {/* <p className="text-gray-500 mt-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                {selectedTicket.location}
                </p> */}

                                {/* Tarih */}
                                {/* <p className="text-gray-500 mt-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-red-500" />
                {selectedTicket.date}
                </p> */}

                                {/* Created By */}
                                {/* <p className="text-gray-500 mt-2 flex items-center text-xs">
                <FaUser className="mr-2 text-gray-500" />
                <span className="font-semibold">Created By: </span> {selectedTicket.createdBy}
                </p> */}

                                {/* Bildirim Türü */}
                                {/* <div className={`mt-3 text-xs font-semibold px-3 py-1 rounded-full inline-block ${notificationTypes[selectedTicket.type]}`}>
                {selectedTicket.type}
                </div> */}

                                {/* Açıklama */}
                                <p className="mt-4 text-gray-700 whitespace-pre-line">{selectedTicket.description}</p>
                                {/* Eğer ticket içinde resim varsa göster */}
                                {selectedTicket.attachedImage && (
                                    <img
                                        src={selectedTicket.attachedImage}
                                        alt="Attached Image"
                                        className="mt-4 w-40 h-auto rounded-lg shadow cursor-pointer hover:opacity-80"
                                        onClick={() => setPreviewImage(selectedTicket.attachedImage)}
                                    />
                                )}

                                {/* 🏷 Büyük Resim Önizleme Modali */}
                                {previewImage && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-full relative">
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                                onClick={() => setPreviewImage(null)}
                                            >
                                                <FaTimes />
                                            </button>
                                            <img src={previewImage} alt="Preview" className="w-full h-auto rounded-lg" />
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Messages Bölümü */}
                            <div className="mt-6 flex-grow flex flex-col bg-gray-100 rounded-lg p-4 overflow-y-auto">
                                <h3 className="text-lg font-semibold mb-2">Messages</h3>
                                <div className="flex flex-col space-y-2">
                                    {(messages[selectedTicket.id] || []).map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`p-2 rounded-lg max-w-xs ${msg.sender === "You" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
                                                }`}
                                        >
                                            {/* 🏷 Mesaj Sahibi */}
                                            <p className="text-xs font-semibold opacity-80 mb-1">
                                                {msg.sender === "You" ? "You" : msg.sender}
                                            </p>

                                            {/* 📂 Dosya Mesajı */}
                                            {msg.fileType === "image" ? (
                                                <img
                                                    src={msg.fileURL}
                                                    alt="Sent file"
                                                    className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                                    onClick={() => setPreviewImage(msg.fileURL)}
                                                />
                                            ) : msg.fileType === "file" ? (
                                                <a
                                                    href={msg.fileURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-200 underline flex items-center"
                                                >
                                                    <FaPaperclip className="mr-1" />
                                                    {msg.text}
                                                </a>
                                            ) : (
                                                <p>{msg.text}</p>
                                            )}

                                            <small className="text-xs">{msg.time}</small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* 🏷 Büyük Resim Önizleme Modali */}
                            {previewImage && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-full relative">
                                        <button
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                            onClick={() => setPreviewImage(null)}
                                        >
                                            <FaTimes />
                                        </button>
                                        <img src={previewImage} alt="Preview" className="w-full h-auto rounded-lg" />
                                    </div>
                                </div>
                            )}
                            {/* Mesaj Yazma Alanı (Sabit Duracak) */}
                            <div className="border-t flex items-center bg-white p-3">
                                <button className="text-gray-500 p-2 hover:text-green-500" onClick={() => fileInputRef.current.click()}>
                                    <FaPaperclip />
                                </button>

                                {/* Dosya seçme inputu - Gizli */}
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

                                <input
                                    ref={messageInputRef} // Ref ekledik
                                    type="text"
                                    className="flex-grow px-3 py-2 border rounded-lg focus:outline-none"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button className="text-blue-500 p-2 hover:text-blue-700" onClick={sendMessage}>
                                    <FaPaperPlane />
                                </button>
                            </div>

                        </>

                    ) : (
                        <p className="text-gray-500 text-center">Select a ticket...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
