import React from "react";

export default function DashboardStats() {
  // Örnek ticket verileri
  const stats = [
    { count: 120, label: "Total Tickets" },
    { count: 54, label: "To Do" },
    { count: 42, label: "In Progress" },
    { count: 24, label: "Done" },
  ];

  return (
    <div className="flex justify-center gap-8 bg-gray-100 py-6 rounded-lg shadow-md">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-gray-200 px-6 py-3 rounded-lg shadow-sm"
        >
          <span className="text-2xl font-bold">{stat.count}</span>
          <span className="text-gray-600 text-sm">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
