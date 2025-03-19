import { useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    FaUser, FaMapMarkerAlt, FaCalendarAlt, FaHashtag, FaEye, FaPlus, FaTimes, FaFileUpload, FaPaperclip,
    FaRegSmile, FaPaperPlane, FaFilter, FaTrash, FaExclamationTriangle, FaUserAstronaut, FaExpand, FaCompress
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // React Router'dan useNavigate'i ekliyoruz


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

const initialTicketData = {
    todo: [],
    inProgress: [],
    done: [],
};

export default function List() {
    const [activeTab, setActiveTab] = useState("todo");
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [ticketData, setTicketData] = useState(initialTicketData);
    const lastToastId = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState({}); // Her ticket için mesajları saklar
    const [newMessage, setNewMessage] = useState("");
    const [filterAssignedTo, setFilterAssignedTo] = useState("");
    const [filterBuilding, setFilteredBuilding] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    // 🏷 Yeni eklenen state (Büyük resim önizleme için)
    const [previewImage, setPreviewImage] = useState(null);
    // ❌ **Delete Confirmation Modal için State**
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    // ✏️ Update Modal için State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [ticketToUpdate, setTicketToUpdate] = useState(null);

    const [customers, setCustomers] = useState([]);
    const [buildings, setBuildings] = useState([]);

    const [selectedTicketForModal, setSelectedTicketForModal] = useState(null);

    const navigate = useNavigate(); // useNavigate hook'u

    // Seçili ticket'ı ID'ye göre hesapla
    const selectedTicket = ticketData[activeTab].find(ticket => ticket.ticketId === selectedTicketId);

    const [ws, setWs] = useState(null);

    const [loading, setLoading] = useState(true);

    // 📌 **Tam ekran mesajlaşma için state**
    const [isChatFullScreen, setIsChatFullScreen] = useState(false);

    // 📌 **Tam ekran modunu değiştiren fonksiyon**
    const toggleChatFullScreen = () => {
        setIsChatFullScreen(!isChatFullScreen);
    };

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

    // 📌 Tarihi "gg/aa/yyyy hh:mm:ss" formatına çeviren fonksiyon
    const formatDate = (dateString) => {
        if (!dateString) return ""; // Eğer tarih boşsa, boş string dön

        // 🔹 Tarih string'ini parçalayarak gün, ay ve yılı al
        const [day, month, year] = dateString.split("."); // "18.03.2025" → ["18", "03", "2025"]

        // 🔹 Yeni bir Date nesnesi oluştur (saat/dakika/saniye ekleyerek)
        const date = new Date(`${year}-${month}-${day}T00:00:00`); // "2025-03-18T00:00:00"

        // 🔹 Formatlı tarih döndür
        return date.toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // 24 saat formatında göstermek için
        });
    };



    // 📌 **Backend'den Ticket'ları Çekme**
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const API_URL = window.location.hostname === "localhost"
                    ? "http://localhost:8080"
                    : "https://api-osius.up.railway.app";

                const response = await fetch("https://api-osius.up.railway.app/tickets");
                if (!response.ok) {
                    throw new Error("Failed to fetch tickets");
                }
                const tickets = await response.json();

                console.log("Fetched Tickets from API:", tickets); // 🔥 Bakalım API ne döndürüyor?

                const todo = tickets.filter(ticket => ticket.status === "ToDo");
                const inProgress = tickets.filter(ticket => ticket.status === "inProgress");
                const done = tickets.filter(ticket => ticket.status === "done");

                console.log("ToDo:", todo);
                console.log("InProgress:", inProgress);
                console.log("Done:", done);

                setTicketData({ todo, inProgress, done });
            } catch (error) {
                console.error("Error fetching tickets:", error);
                toast.error("Error fetching tickets!", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);


    const moveTicket = async (ticket, from, to) => {
        console.log("Sending ticketId to backend:", ticket.ticketId); // 🛠 Debug log
        try {
            console.log(`Moving Ticket: ${ticket.ticketId} from ${from} to ${to}`); // 🔥 Debug için

            const API_URL = window.location.hostname === "localhost"
                ? "http://localhost:8080"
                : "https://api-osius.up.railway.app";

            const response = await fetch(`https://api-osius.up.railway.app/tickets/${ticket.ticketId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: to }),
            });

            if (!response.ok) {
                throw new Error("Failed to update ticket status!");
            }

            // ✅ **State içindeki doğru ticket'i güncelle**
            setTicketData((prev) => {
                const updatedTickets = {
                    ...prev,
                    [from]: prev[from].filter((t) => t.ticketId !== ticket.ticketId), // ❌ Yanlış ID seçilmesini engelle
                    [to]: [...prev[to], { ...ticket, status: to }],
                };

                console.log("Updated Ticket Data:", updatedTickets); // 🔥 Güncellenen ticket'leri ekrana basalım

                return updatedTickets;
            });

        } catch (error) {
            console.error("Error updating ticket status:", error);
            toast.error("Failed to update ticket status!");
        }
    };



    const sendMessage = (file = null) => {
        if (!newMessage.trim() && !file) return; // 📌 Ne mesaj ne de dosya varsa çık

        if (!selectedTicket) return; // 📌 Seçili ticket yoksa çık

        let fileURL = null;
        let fileType = null;

        // 📌 **Eğer dosya varsa, dosya URL'sini oluştur**
        if (file) {
            try {
                fileURL = URL.createObjectURL(file);
                fileType = file.type.startsWith("image/") ? "image" : "file";
            } catch (error) {
                console.error("❌ Dosya URL oluşturulamadı:", error);
                return;
            }
        }

        // 📌 **Gönderilecek mesaj objesini hazırla**
        const messageData = {
            ticket_id: selectedTicket.ticketId,
            sender: "You",
            text: file ? (fileType === "image" ? "📷 Sent an image" : "📎 Sent a file") : newMessage,
            created_at: new Date().toISOString(),
            file_url: fileURL, // 📌 Eğer dosya yoksa null olacak
        };

        // 📌 **WebSocket ile mesaj gönder**
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(messageData));
        } else {
            console.error("❌ WebSocket bağlantısı kapalı!");
            toast.error("Connection lost! Reconnecting...", { position: "top-right" });
            return;
        }

        // 📌 **Mesajı hemen ekrana yansıt**
        setMessages((prev) => ({
            ...prev,
            [selectedTicket.ticketId]: [...(prev[selectedTicket.ticketId] || []), messageData],
        }));

        setNewMessage(""); // 📌 Text mesaj kutusunu temizle
    };





    // Dosya seçme için ref
    const fileInputRef = useRef(null);
    // Dosya seçildiğinde çağrılacak fonksiyon
    //   const handleFileUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //       setMessages((prev) => ({
    //         ...prev,
    //         [selectedTicket.ticketId]: [
    //           ...(prev[selectedTicket.ticketId] || []),
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
        event.preventDefault(); // Event'in doğal davranışını engelle

        const file = event.target.files[0];
        if (!file) {
            console.error("❌ Dosya seçilmedi!");
            return;
        }

        // 📌 **Dosya URL'si oluştur**
        let fileURL;
        try {
            fileURL = URL.createObjectURL(file);
        } catch (error) {
            console.error("❌ Geçersiz dosya formatı:", error);
            return;
        }

        const fileType = file.type.startsWith("image/") ? "image" : "file"; // Resim mi, yoksa başka dosya mı?

        // 📌 **WebSocket ile mesaj gönder**
        sendMessage(file);

        // 📌 **Mesajları ekrana yansıt**
        setMessages((prev) => ({
            ...prev,
            [selectedTicket.ticketId]: [
                ...(prev[selectedTicket.ticketId] || []),
                {
                    text: file.name,
                    sender: "You",
                    time: new Date().toLocaleTimeString(),
                    fileType,
                    fileURL,
                },
            ],
        }));

        // 📌 **Dosya input'unu sıfırla, böylece aynı dosya tekrar seçildiğinde de çalışır**
        event.target.value = "";
    };



    // Filtreleme fonksiyonu
    const filteredTickets = ticketData[activeTab].filter(ticket =>
        (filterAssignedTo ? ticket.assignedTo === filterAssignedTo : true) &&
        (filterCategory ? ticket.type === filterCategory : true) &&
        (filterBuilding ? ticket.building === filterBuilding : true) // 🔄 Güncellendi
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

    // // ✅ **Ticket Silme Fonksiyonu**
    // const confirmDeleteTicket = () => {
    //     if (!ticketToDelete) return;

    //     setTicketData((prev) => ({
    //         ...prev,
    //         [activeTab]: prev[activeTab].filter((t) => t.id !== ticketToDelete.id),
    //     }));

    //     setSelectedTicket(null);
    //     setIsDeleteModalOpen(false);
    //     toast.success("Ticket deleted successfully!", { position: "top-right" });
    // };


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
                            [selectedTicket.ticketId]: [
                                ...(prev[selectedTicket.ticketId] || []),
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

    // 📌 API'den Customers ve Buildings çekme
    useEffect(() => {
        const fetchCustomersAndBuildings = async () => {
            try {
                const API_URL = window.location.hostname === "localhost"
                    ? "http://localhost:8080"
                    : "https://api-osius.up.railway.app";
                const [customersResponse, buildingsResponse] = await Promise.all([
                    fetch("https://api-osius.up.railway.app/workers"),
                    fetch("https://api-osius.up.railway.app/customers"),
                    fetch("https://api-osius.up.railway.app/buildings"),
                ]);

                if (!customersResponse.ok || !buildingsResponse.ok) {
                    throw new Error("Failed to fetch data");
                }

                const customersData = await customersResponse.json();
                const buildingsData = await buildingsResponse.json();

                setCustomers(customersData);
                setBuildings(buildingsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching customers/buildings!", { position: "top-right" });
            }
        };

        fetchCustomersAndBuildings();
    }, []);

    // // 📌 Seçili Ticket'ı Güncelleme Fonksiyonu
    // const handleSelectTicket = async (ticket) => {
    //     setSelectedTicketId(ticket.ticketId);

    //     try {
    //         const API_URL = window.location.hostname === "localhost"
    //             ? "http://localhost:8080"
    //             : "https://api-osius.up.railway.app";
    //         const response = await fetch(`http://localhost:8080/messages/${ticket.ticketId}`);
    //         if (!response.ok) {
    //             throw new Error("Mesajlar yüklenemedi");
    //         }
    //         const ticketMessages = await response.json();

    //         // 📌 **Dosya ve resimleri mesajlara ekleyelim**
    //         const formattedMessages = ticketMessages.map(msg => ({
    //             ...msg,
    //             fileType: msg.file_url ? (msg.file_url.endsWith(".jpg") || msg.file_url.endsWith(".png") ? "image" : "file") : null,
    //         }));

    //         setMessages((prev) => ({
    //             ...prev,
    //             [ticket.ticketId]: formattedMessages,
    //         }));
    //     } catch (error) {
    //         console.error("❌ Mesajları yüklerken hata:", error);
    //     }
    // };

    // 📌 Seçili Ticket'ı Güncelleme Fonksiyonu (Mesajları ve Dosyaları Aynı Anda Çekiyor)
    const handleSelectTicket = async (ticket) => {
        setSelectedTicketId(ticket.ticketId);

        try {
            const API_URL = window.location.hostname === "localhost"
                ? "http://localhost:8080"
                : "https://api-osius.up.railway.app";

            const [messagesResponse, filesResponse] = await Promise.all([
                fetch(`https://api-osius.up.railway.app/messages/${ticket.ticketId}`),
                fetch(`https://api-osius.up.railway.app/tickets/${ticket.ticketId}/files`)
            ]);

            if (!messagesResponse.ok) throw new Error("Mesajlar yüklenemedi");
            if (!filesResponse.ok) throw new Error("Dosyalar yüklenemedi");

            const ticketMessages = await messagesResponse.json();
            const ticketFiles = await filesResponse.json();

            console.log("✅ API'den Gelen Dosyalar:", ticketFiles); // 🔥 **Gelen dosya listesini kontrol et!**

            setTicketData((prev) => {
                const updatedData = {
                    ...prev,
                    [activeTab]: prev[activeTab].map(t =>
                        t.ticketId === ticket.ticketId ? { ...t, files: ticketFiles } : t
                    ),
                };

                console.log("✅ Güncellenmiş TicketData:", updatedData); // 🔥 Güncellenen state'i kontrol et!
                return updatedData;
            });

            // Mesajları set et
            setMessages((prev) => ({
                ...prev,
                [ticket.ticketId]: ticketMessages.map(msg => ({
                    ...msg,
                    fileType: msg.file_url ? (msg.file_url.endsWith(".jpg") || msg.file_url.endsWith(".png") ? "image" : "file") : null,
                })),
            }));

        } catch (error) {
            console.error("❌ Mesajları veya dosyaları yüklerken hata:", error);
        }
    };


    useEffect(() => {
        if (selectedTicket?.files) {
            console.log("🖼 Gelen Dosya Listesi:", selectedTicket.files);
        }
    }, [selectedTicket]);


    useEffect(() => {
        if (selectedTicketId) {
            handleSelectTicket({ ticketId: selectedTicketId });
        }
    }, [selectedTicketId]);


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const API_URL = window.location.hostname === "localhost"
                    ? "http://localhost:8080"
                    : "https://api-osius.up.railway.app";
                const response = await fetch("https://api-osius.up.railway.app/tickets");
                if (!response.ok) {
                    throw new Error("Failed to fetch tickets");
                }
                const tickets = await response.json();

                // 🏷 **Status'e göre kategorilere ayır**
                const todo = tickets.filter(ticket => ticket.status === "ToDo");
                const inProgress = tickets.filter(ticket => ticket.status === "inProgress");
                const done = tickets.filter(ticket => ticket.status === "done");

                // 🎯 **State'i güncelle**
                setTicketData({ todo, inProgress, done });

                // 🏆 **Varsayılan olarak en çok ticket içeren sekmeyi aç!**
                const maxCategory = Object.entries({ todo, inProgress, done }).reduce(
                    (max, [key, value]) => (value.length > max.count ? { key, count: value.length } : max),
                    { key: "todo", count: 0 } // Varsayılan olarak "ToDo"
                ).key;

                setActiveTab(maxCategory);

            } catch (error) {
                console.error("Error fetching tickets:", error);
                toast.error("Error fetching tickets!", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    console.log("✅ selectedTicketId:", selectedTicketId);
    console.log("✅ ticketData:", ticketData);
    console.log("✅ activeTab:", activeTab);
    console.log("✅ ticketData[activeTab]:", ticketData[activeTab]);

    useEffect(() => {
        console.log("📌 API'den Gelen Ticketlar:", ticketData);
    }, [ticketData]);

    // 📌 **WebSocket Bağlantısını Kur**
    useEffect(() => {
        // let socket = new WebSocket("ws://https://api-osius.up.railway.app/ws");
        // ✅ **Prod vs. Local ortamı tespit et**
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        const wsHost = window.location.hostname === "localhost"
            ? "localhost:8080/ws" // 🛠 **Local ortam**
            : "api-osius.up.railway.app/ws"; // 🌍 **Prod ortam**

        const socket = new WebSocket(`${wsProtocol}://${wsHost}`);

        socket.onopen = () => {
            console.log("✅ WebSocket bağlantısı kuruldu!");
            setWs(socket);
        };

        socket.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            console.log("📩 Gelen WebSocket Mesajı:", receivedMessage);

            // 📌 **Gelen mesajın zaten var olup olmadığını kontrol et**
            setMessages((prevMessages) => {
                const existingMessages = prevMessages[receivedMessage.ticket_id] || [];

                // 🎯 Eğer mesaj zaten varsa, tekrar ekleme
                if (existingMessages.some(msg => msg.created_at === receivedMessage.created_at)) {
                    return prevMessages;
                }

                return {
                    ...prevMessages,
                    [receivedMessage.ticket_id]: [...existingMessages, receivedMessage],
                };
            });
        };

        socket.onerror = (error) => {
            console.error("❌ WebSocket Hatası:", error);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket bağlantısı kapatıldı. Yeniden bağlanıyor...");
            setTimeout(() => {
                const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
                const wsHost = window.location.hostname === "localhost"
                    ? "localhost:8080/ws" // 🛠 **Local ortam**
                    : "api-osius.up.railway.app/ws"; // 🌍 **Prod ortam**
                setWs(new WebSocket(`${wsProtocol}://${wsHost}`));
            }, 3000);
        };


        return () => {
            socket.close();
        };
    }, []);

    const getFullFileURL = (fileURL) => {
        if (!fileURL || typeof fileURL !== "string") {
            return ""; // Eğer fileURL tanımlı değilse, boş string döndür
        }
        if (!fileURL.startsWith("http")) {
            // return `${API_URL}${fileURL}`;
            return `https://api-osius.up.railway.app${fileURL}`;
        }
        return fileURL;
    };


    const confirmDeleteTicket = async () => {
        if (!ticketToDelete) return;

        try {
            const API_URL = window.location.hostname === "localhost"
                ? "http://localhost:8080"
                : "https://api-osius.up.railway.app";

            const response = await fetch(`https://api-osius.up.railway.app/tickets/${ticketToDelete.ticketId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete ticket");
            }

            // **State'den silinen ticket'ı çıkar**
            setTicketData((prev) => ({
                ...prev,
                [activeTab]: prev[activeTab].filter((t) => t.ticketId !== ticketToDelete.ticketId),
            }));

            setSelectedTicketId(null); // ✅ Seçili ticket'ı temizle
            setIsDeleteModalOpen(false); // ✅ Modal'ı kapat

            toast.success("Ticket deleted successfully!", { position: "top-right" });

        } catch (error) {
            console.error("Error deleting ticket:", error);
            toast.error("Failed to delete ticket!");
        }
    };



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
                                setSelectedTicketId(null);
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

                    {/* 📌 Assignee yerine Customer filtresi */}
                    <select className="border px-3 py-2 rounded-lg" value={filterAssignedTo} onChange={e => setFilterAssignedTo(e.target.value)}>
                        <option value="">Filter by Customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.name}>{customer.name}</option>
                        ))}
                    </select>

                    {/* 📌 Bildirim türüne göre filtreleme */}
                    <select className="border px-3 py-2 rounded-lg" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">Filter by Category</option>
                        {Object.keys(notificationTypes).map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* 📌 Bina filtresi */}
                    <select className="border px-3 py-2 rounded-lg" value={filterBuilding} onChange={e => setFilteredBuilding(e.target.value)}>
                        <option value="">Filter by Building</option>
                        {buildings.map(building => (
                            <option key={building.id} value={building.name}>{building.name}</option>
                        ))}
                    </select>

                    {/* 🔄 Filtreleri temizleme butonu */}
                    <button
                        className="bg-gray-500 text-white px-3 py-2 rounded-lg"
                        onClick={() => {
                            setFilterAssignedTo("");
                            setFilterCategory("");
                            setFilteredBuilding("");
                        }}
                    >
                        Clear
                    </button>
                </div>


                {/* "+ Add Ticket" Butonu */}
                <button
                    onClick={() => navigate("/dashboard/list/add", {
                        state: {
                            newTicket: {
                                title: "",
                                description: "",
                                assignedTo: "",
                                date: new Date().toLocaleDateString("tr-TR"),
                                customer: "",
                                building: "",
                                file: null,
                                attachedImage: null,
                                created_by: localStorage.getItem("name") || "Unknown", // 👈 **Oturum Açan Kişinin Adı**
                            }
                        }
                    })}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition-all"
                >
                    <FaPlus />
                    Add Ticket
                </button>
            </div>

            {/* İçerik Alanı (Sol + Sağ) */}
            <div className="flex flex-grow bg-white shadow-lg rounded-lg overflow-hidden h-full mb-13">

                {/* Sol: Ticket Listesi */}
                <div className="w-1/3 bg-gray-50 overflow-y-auto h-full p-4">
                    {ticketData[activeTab]
                        .sort((a, b) => {
                            const numA = parseInt(a.ticketId.replace("T-", ""), 10);
                            const numB = parseInt(b.ticketId.replace("T-", ""), 10);
                            return numB - numA; // Büyükten küçüğe sıralama
                        })
                        .filter((ticket) => !filterAssignedTo || ticket.customer === filterAssignedTo)
                        .filter((ticket) => !filterBuilding || ticket.building === filterBuilding)
                        .filter((ticket) => !filterCategory || ticket.type === filterCategory)
                        .map((ticket) => (
                            <div
                                key={ticket.ticketId}
                                onClick={() => setSelectedTicketId(ticket.ticketId)} // 🔥 **ID üzerinden seçim yap**
                                className={`p-4 mb-2 rounded-lg cursor-pointer shadow-md transition-all ${selectedTicketId === ticket.ticketId
                                    ? "bg-blue-200 border-l-4 border-blue-500"
                                    : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                {/* Ticket ID */}
                                <div className="flex items-center text-gray-500 text-xs mb-2">
                                    <FaHashtag className="mr-2 text-gray-400" />
                                    <span className="font-bold">{ticket.ticketId}</span>
                                </div>

                                {/* Ticket Başlığı */}
                                <h3 className="text-md font-bold">{ticket.title}</h3>

                                {/* Açıklama (2 Satır Gösterim) */}
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {ticket.description.length > 100 ? (
                                        <>
                                            {ticket.description.slice(0, 50)}...{" "}
                                            <button
                                                onClick={() => {
                                                    setSelectedTicketForModal(ticket);
                                                    setIsModalOpen(true);
                                                    e.stopPropagation(); // 📌 Kartın genişlemesini engelle

                                                }}
                                                className="text-blue-500 font-semibold hover:underline"
                                            >
                                                Read more
                                            </button>
                                        </>
                                    ) : (
                                        ticket.description
                                    )}
                                </p>
                                {/* Konum, Kişi ve Tarih */}
                                <div className="flex justify-between text-gray-600 text-xs mt-4">
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="mr-1 text-green-500" />
                                        <span>{ticket.building}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaUser className="mr-1 text-blue-500" />
                                        <span>Customer: {ticket.Customer}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-1 text-red-500" />
                                        <span>{formatDate(ticket.date)}</span> {/* ✅ Tarih formatlandı */}
                                    </div>
                                </div>
                                <div className="flex justify-between text-gray-600 text-xs mt-4">
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="mr-1 text-green-500" />
                                        <span>Assign To: {ticket.worker}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-gray-600 text-xs mt-4">
                                    <div className="flex items-center">
                                        <FaUserAstronaut className="mr-1 text-green-500" />
                                        <span>Created from: {ticket.createdBy}</span>
                                    </div>
                                </div>

                                {/* Bildirim Türü */}
                                <div className={`mt-3 text-xs font-semibold px-3 py-1 rounded-full inline-block ${notificationTypes[ticket.notificationType]}`}>
                                    {ticket.notificationType}
                                </div>
                            </div>
                        ))}
                </div>


                {/* Açıklama Modalı */}
                <Transition appear show={isModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-full max-h-[80vh] overflow-y-auto">
                                <Dialog.Title className="text-xl font-semibold mb-4 flex items-center">
                                    <FaEye className="mr-2 text-blue-500" />
                                    {selectedTicketForModal?.title}
                                </Dialog.Title>

                                {/* Açıklama İçeriği */}
                                <div className="max-h-[50vh] overflow-y-auto text-gray-700 break-words">
                                    {selectedTicketForModal?.description}
                                </div>

                                <button
                                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close
                                </button>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                </Transition>


                {/* Sağ: Ticket Detayı + Mesajlar */}
                <div className="w-2/3 p-6 flex flex-col h-full">
                    {selectedTicket ? (
                        <>
                            <div>
                                {/* Ticket ID */}
                                <div className="flex items-center text-gray-500 text-sm mb-2">
                                    <FaHashtag className="mr-2 text-gray-400" />
                                    <span className="font-bold">{selectedTicket.ticketId}</span>
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
                                    {selectedTicket.building}
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

                                {/* Açıklama (2 Satır Gösterim) */}
                                <p className="mt-4 text-gray-700 whitespace-pre-line break-words">
                                    {selectedTicket.description.length > 150 ? (
                                        <>
                                            {selectedTicket.description.slice(0, 70)}...
                                            <span
                                                onClick={() => {
                                                    setSelectedTicketForModal(selectedTicket); // 🔥 **Modal için seçili ticket'ı ayarla**
                                                    setIsModalOpen(true); // 🔥 **Modalı aç**
                                                }}
                                                className="text-blue-500 font-semibold hover:underline cursor-pointer ml-1"
                                            >
                                                Read more
                                            </span>
                                        </>
                                    ) : (
                                        selectedTicket.description
                                    )}
                                </p>

                                {/* Eğer ticket içinde birden fazla dosya varsa göster */}
                                {selectedTicket?.files?.length > 0 ? (
                                    <div className="mt-4 flex gap-3 overflow-x-auto">
                                        {selectedTicket.files.map((file, index) => {
                                            const fileURL = getFullFileURL(file?.fileUrl || file?.FileURL || "");

                                            console.log("🎯 Görüntülenecek Dosya URL'si:", fileURL);

                                            return (
                                                <div key={index} className="relative">
                                                    {fileURL && (fileURL.toLowerCase().endsWith(".jpg") || fileURL.toLowerCase().endsWith(".png")) ? (
                                                        <img
                                                            src={fileURL}
                                                            alt={`Attachment ${index + 1}`}
                                                            className="w-24 h-24 object-cover rounded-lg shadow cursor-pointer hover:opacity-80"
                                                            onClick={() => setPreviewImage(fileURL)}
                                                        />
                                                    ) : (
                                                        fileURL ? (
                                                            <a
                                                                href={fileURL}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 underline flex items-center"
                                                            >
                                                                <FaPaperclip className="mr-2" />
                                                                {file?.Filename || "Unknown File"}
                                                            </a>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm italic">No file available</p>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No files attached to this ticket.</p>
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
                            {/* <div className="mt-6 flex-grow flex flex-col bg-gray-100 rounded-lg p-4 overflow-y-auto"> */}
                            <div className={`mt-6 flex-grow flex flex-col bg-gray-100 rounded-lg p-4 overflow-y-auto transition-all duration-300
    ${isChatFullScreen ? "fixed inset-0 z-50 w-screen h-screen bg-white p-6 shadow-xl" : ""}
`}>
                                {/* 🎯 Tam ekran açma/kapatma butonu - Mesaj alanının içinde */}
                                {/* <div className="absolute top-2 right-2">
                                    <button
                                        className="bg-gray-200 p-3 rounded-full shadow hover:bg-gray-300 transition"
                                        onClick={toggleChatFullScreen}
                                    >
                                        {isChatFullScreen ? <FaCompress className="text-gray-700 text-xl" /> : <FaExpand className="text-gray-700 text-xl" />}
                                    </button>
                                </div> */}

                                {/* 🎯 Başlık ve Tam Ekran Butonu */}
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">Messages</h3>
                                    <button
                                        className="bg-gray-200 p-3 rounded-full shadow hover:bg-gray-300 transition"
                                        onClick={toggleChatFullScreen}
                                    >
                                        {isChatFullScreen ? <FaCompress className="text-gray-700 text-xl" /> : <FaExpand className="text-gray-700 text-xl" />}
                                    </button>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    {(messages[selectedTicket.ticketId] || []).map((msg, index) => (
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
                            <div
                                className={`border-t flex items-center bg-white p-3 transition-all duration-300 
        ${isChatFullScreen ? "fixed bottom-0 left-0 w-full p-4 bg-gray-100 z-50" : ""}`}
                            >
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
                                <button className="text-blue-500 p-2 hover:text-blue-700" onClick={() => sendMessage()} onKeyDown={(e) => {
                                    // if (e.key === "Enter" && !e.shiftKey) {
                                    //     e.preventDefault();
                                    //     sendMessage();
                                    // }
                                }}>
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
