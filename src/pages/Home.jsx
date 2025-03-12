import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Home() {
  const navigate = useNavigate(); // Sayfa yönlendirme için

  // Ticket verileri
  const ticketData = {
    todo: [
        { id: "1", code: "T-001", title: "Design Login Page", description: "Create a login page UI", assignedTo: "Cem Tanrikut", date: "28-02-2025", location: "Amsterdam", type: "Vraag", createdBy: "Cem Tanrikut", status: "To Do" },
        { id: "2", code: "T-002", title: "Fix Authentication Bug", description: "Debug login issues", assignedTo: "Ramazan", date: "28-02-2025", location: "Rotterdam", type: "Klacht", createdBy: "Cem Tanrikut", status: "To Do" },
        { id: "3", code: "T-003", title: "Setup Database", description: "Configure MongoDB instance", assignedTo: "Abdullah Soyaslan", date: "27-02-2025", location: "Utrecht", type: "Melding", createdBy: "Cem Tanrikut", status: "To Do" },
      ],
      inProgress: [
        { id: "4", code: "T-004", title: "API Integration", description: "Connect frontend with backend", assignedTo: "Cem Tanrikut", date: "27-02-2025", location: "The Hague", type: "Extra Werk", createdBy: "Cem Tanrikut", status: "In Progress" },
        { id: "5", code: "T-005", title: "Dashboard Charts", description: "Implement analytics dashboard", assignedTo: "Jony Ive", date: "26-02-2025", location: "Eindhoven", type: "Complimenten", createdBy: "Cem Tanrikut", status: "In Progress" },
        { id: "6", code: "T-006", title: "Refactor Codebase", description: "Optimize component structure", assignedTo: "Ramazan", date: "25-02-2025", location: "Groningen", type: "Ongegrond", createdBy: "Cem Tanrikut", status: "In Progress" },
      ],
      done: [
        { id: "7", code: "T-007", title: "Create UI Mockups", description: "Design wireframes for app", assignedTo: "Abdullah Soyaslan", date: "24-02-2025", location: "Haarlem", type: "Vraag", createdBy: "Cem Tanrikut", status: "Done" },
        { id: "8", code: "T-008", title: "Implement Dark Mode", description: "Add theme switching", assignedTo: "Cem Tanrikut", date: "23-02-2025", location: "Leiden", type: "Complimenten", createdBy: "Cem Tanrikut", status: "Done" },
        { id: "9", code: "T-009", title: "Optimize Queries", description: "Improve database performance", assignedTo: "Jony Ive", date: "22-02-2025", location: "Maastricht", type: "Comentaar", createdBy: "Cem Tanrikut", status: "Done" },
        { id: "10", code: "T-010", title: "Deploy to Production", description: "Push latest release", assignedTo: "Abdullah Soyaslan", date: "21-02-2025", location: "Delft", type: "Melding", createdBy: "Cem Tanrikut", status: "Done" },
      ],
  };

  // Toplam ticket sayısı
  const totalTickets = ticketData.todo.length + ticketData.inProgress.length + ticketData.done.length;

  // Pie Chart için veri
  const pieData = [
    { name: "To Do", value: ticketData.todo.length, color: "#EF4444" },
    { name: "In Progress", value: ticketData.inProgress.length, color: "#FACC15" },
    { name: "Done", value: ticketData.done.length, color: "#22C55E" },
  ];

  // Kullanıcı bazlı ticket verisi
  const users = ["Cem Tanrikut", "Ramazan", "Abdullah Soyaslan", "Jony Ive"];
  const userTickets = users.map((user) => ({
    user,
    todo: ticketData.todo.filter((t) => t.assignedTo === user).length,
    inProgress: ticketData.inProgress.filter((t) => t.assignedTo === user).length,
    done: ticketData.done.filter((t) => t.assignedTo === user).length,
  }));

  // Tüm ticket'ları birleştir ve son güncellenen 5 tanesini al
  const allTickets = [...ticketData.todo, ...ticketData.inProgress, ...ticketData.done];
  const recentTickets = allTickets
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
    {/* 🚀 Ticket Stats - Yeni Eklenen Bölüm */}
    <div className="flex justify-center gap-8 bg-gray-100 py-6 rounded-lg shadow-md mb-6 w-1/2">
      {[
        { count: 120, label1: "Total", label2: "tickets", path: "/dashboard/list" },
        { count: 54, label1: "To Do", label2: "tickets", path: "/dashboard/list?tab=todo" },
        { count: 42, label1: "In Progress", label2: "tickets", path: "/dashboard/list?tab=inprogress" },
        { count: 24, label1: "Done", label2: "tickets", path: "/dashboard/list?tab=done" },
      ].map((stat, index) => (
        <div 
          key={index} 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate(stat.path)}
        >
          {/* Kutu içindeki sayı */}
          <div className="bg-gray-200 text-black font-bold text-lg px-4 py-3 rounded-lg shadow-sm">
            {stat.count}
          </div>
          {/* Yanındaki iki satırlık text */}
          <div className="flex flex-col leading-tight">
            <span className="text-gray-600 text-sm">{stat.label1}</span>
            <span className="text-gray-600 text-sm">{stat.label2}</span>
          </div>
        </div>
      ))}
    </div>
    {/* 📌 Recent Tickets Bölümü */}
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-1/2">
        <h2 className="text-lg font-semibold mb-4">📌 Recent Tickets</h2>
        <div className="space-y-4">
          {recentTickets.map((ticket) => (
            <div key={ticket.code} className="border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => navigate(`/dashboard/tickets/${ticket.code}`)}
            >
              {/* Ticket Etiketi ve Zaman Bilgisi */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                  "bg-gray-300 text-black"
                }`}>
                  {ticket.status || "Done"}
                </span>
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                  ticket.priority === "critical" ? "bg-black text-white" :
                  ticket.priority === "warning" ? "bg-yellow-500 text-black" :
                  "bg-gray-300 text-black"
                }`}>
                  {ticket.type || "Done"}
                </span>
                <span>
                <div className="text-gray-500 text-sm">{ticket.date}</div>
                </span>
              </div>

              {/* Ticket Başlık ve Bilgi */}
              <div className="text-gray-900 font-medium mt-1">{ticket.title}</div>
              <div className="text-gray-500 text-sm">⭐ {ticket.assignedTo} 📍 {ticket.location}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Ticket Durumları Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">📊 Ticket Status</h2>
          <div onClick={() => navigate("/dashboard/tickets")} className="cursor-pointer">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        

        {/* Kullanıcı Bazlı Ticket Dağılımı - Geliştirilmiş Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">👤 User Tickets</h2>
          
          {/* Responsive Container ile grafik ekran boyutuna uyumlu olacak */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={userTickets} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="user" type="category" tick={{ fontSize: 14 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="todo" fill="#EF4444" name="To Do" barSize={30} />
              <Bar dataKey="inProgress" fill="#FACC15" name="In Progress" barSize={30} />
              <Bar dataKey="done" fill="#22C55E" name="Done" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
