import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaFileAlt, FaHashtag, FaPlus } from "react-icons/fa";

// Sütun renkleri
const columnColors = {
    todo: "bg-red-500",
    inProgress: "bg-yellow-500",
    done: "bg-green-500"
};

// Bildirim türleri için renkler
const notificationTypes = {
    Complimenten: "bg-green-300 text-green-800",
    Comentaar: "bg-blue-300 text-blue-800",
    Vraag: "bg-yellow-300 text-yellow-800",
    Klacht: "bg-red-300 text-red-800",
    Melding: "bg-gray-300 text-gray-800",
    "Extra Werk": "bg-purple-300 text-purple-800",
    Ongegrond: "bg-orange-300 text-orange-800"
};

export default function Tickets() {
    const [tasks, setTasks] = useState({
        todo: [
            { id: "T-001", title: "Add new feature", assignedTo: "Cem Tanrikut", date: "27-02-2025 14:20", type: "Vraag", location: "Utrecht", file: "feature_doc.pdf" },
            { id: "T-002", title: "Bug fix", assignedTo: "Ramazan", date: "26-02-2025", type: "Klacht", location: "Osius Amsterdam Office", file: null }
        ],
        inProgress: [
            { id: "T-003", title: "Database integration", assignedTo: "Abdullah Soyaslan", date: "25-02-2025 17:55", type: "Comentaar", location: "Amsterdam", file: "db_schema.png" },
            { id: "T-005", title: "Mobile development with React Native", assignedTo: "Cem Tanrikut", date: "25-02-2025 15:33", type: "Comentaar", location: "Amsterdam", file: "react_native.jsx" }

        ],
        done: [
            { id: "T-004", title: "Update for UI", assignedTo: "Jony Ive", date: "24-02-2025 11:09", type: "Complimenten", location: "Apple, California", file: "design_final.jpg" }
        ]
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const sourceColumn = tasks[source.droppableId];
        const destColumn = tasks[destination.droppableId];

        if (source.droppableId === destination.droppableId) {
            const updatedColumn = [...sourceColumn];
            const [movedItem] = updatedColumn.splice(source.index, 1);
            updatedColumn.splice(destination.index, 0, movedItem);

            setTasks({
                ...tasks,
                [source.droppableId]: updatedColumn
            });
        } else {
            const sourceItems = [...sourceColumn];
            const destItems = [...destColumn];
            const [movedItem] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, movedItem);

            setTasks({
                ...tasks,
                [source.droppableId]: sourceItems,
                [destination.droppableId]: destItems
            });
        }
    };

    return (
        <div className="p-6">
            {/* Üst Kısım: Başlık ve Buton */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Meldingen</h1>

                {/* New Ticket Butonu */}
                <button
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition-all"
                    onClick={() => alert("New Ticket Modal Açılacak!")}
                >
                    <FaPlus />
                    New Ticket
                </button>
            </div>

            {/* Trello Tarzı Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-6">
                    {Object.entries(tasks).map(([columnId, items]) => (
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 flex flex-col"
                                >
                                    {/* Sütun Başlığı (Tam Genişlik) */}
                                    <h2 className={`text-lg font-semibold text-white p-3 -m-4 mb-4 text-center ${columnColors[columnId]} rounded-t-lg`}>
                                        {columnId === "todo" && "📌 To Do"}
                                        {columnId === "inProgress" && "⚡ In Progress"}
                                        {columnId === "done" && "✅ Done"}
                                    </h2>

                                    {/* Kartlar */}
                                    <div className="min-h-[300px] p-3">
                                        {items.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 my-3 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-all"
                                                    >
                                                        {/* Ticket ID */}
                                                        <div className="flex items-center text-gray-500 text-xs mb-2">
                                                            <FaHashtag className="mr-1 text-gray-400" />
                                                            <span className="font-bold">{task.id}</span>
                                                        </div>

                                                        {/* Ticket Başlığı */}
                                                        <h3 className="text-md font-bold">{task.title}</h3>

                                                        {/* Atanan Kişi */}
                                                        <div className="flex items-center text-gray-600 text-sm mt-2">
                                                            <FaUser className="mr-2 text-blue-500" />
                                                            <span>{task.assignedTo}</span>
                                                        </div>

                                                        {/* Konum */}
                                                        <div className="flex items-center text-gray-600 text-sm mt-2">
                                                            <FaMapMarkerAlt className="mr-2 text-green-500" />
                                                            <span>{task.location}</span>
                                                        </div>

                                                        {/* Tarih */}
                                                        <div className="flex items-center text-gray-600 text-sm mt-2">
                                                            <FaCalendarAlt className="mr-2 text-red-500" />
                                                            <span>{task.date}</span>
                                                        </div>

                                                        {/* Yüklenen Dosya */}
                                                        {task.file && (
                                                            <div className="flex items-center text-gray-600 text-sm mt-2">
                                                                <FaFileAlt className="mr-2 text-purple-500" />
                                                                <a href={`/${task.file}`} className="underline text-blue-600 hover:text-blue-800">
                                                                    {task.file}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {/* Bildirim Türü */}
                                                        <div className={`mt-3 text-xs font-semibold px-3 py-1 rounded-full inline-block ${notificationTypes[task.type]}`}>
                                                            {task.type}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
