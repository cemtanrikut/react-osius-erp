import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Home() {
  const navigate = useNavigate(); // Sayfa yönlendirme için

  // Ticket verileri
  const ticketData = {
    todo: [
      { id: "T-001", title: "Add new feature", assignedTo: "Cem Tanrikut" },
      { id: "T-002", title: "Bug fix", assignedTo: "Ramazan" },
    ],
    inProgress: [
      { id: "T-003", title: "Database integration", assignedTo: "Abdullah Soyaslan" },
      { id: "T-005", title: "Mobile development with React Native", assignedTo: "Cem Tanrikut" },
    ],
    done: [
      { id: "T-004", title: "Update for UI", assignedTo: "Jony Ive" },
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

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
