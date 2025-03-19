{/* Ticket Detayları */}
<div className="bg-blue-100 p-4 rounded-lg shadow-md">
    {/* Ticket ID */}
    <div className="flex items-center text-gray-500 text-xs mb-2">
        <FaHashtag className="mr-2 text-gray-400" />
        <span className="font-bold">{selectedTicket.ticketId}</span>
    </div>

    {/* Ticket Başlığı */}
    <h3 className="text-md font-bold">{selectedTicket.title}</h3>

    {/* Konum (Building) */}
    <div className="flex items-center mt-2 text-gray-700">
        <FaMapMarkerAlt className="mr-2 text-green-500" />
        <span>{selectedTicket.building ? selectedTicket.building : "Not Specified"}</span>
    </div>

    {/* Müşteri (Customer) */}
    <div className="flex items-center mt-2 text-gray-700">
        <FaUser className="mr-2 text-blue-500" />
        <span>Customer: {selectedTicket.customer ? selectedTicket.customer : "Not Specified"}</span>
    </div>

    {/* Oluşturulma Tarihi */}
    <div className="flex items-center mt-2 text-gray-700">
        <FaCalendarAlt className="mr-2 text-red-500" />
        <span>{selectedTicket.date}</span>
    </div>

    {/* Created By */}
    <div className="flex items-center mt-2 text-gray-700">
        <FaUser className="mr-2 text-gray-500" />
        <span><strong>Created By:</strong> {selectedTicket.createdBy ? selectedTicket.createdBy : "Unknown"}</span>
    </div>

    {/* Assigned To */}
    <div className="flex items-center mt-2 text-gray-700">
        <FaUser className="mr-2 text-gray-500" />
        <span><strong>Assigned To:</strong> {selectedTicket.assignedTo ? selectedTicket.assignedTo : "Not Assigned"}</span>
    </div>
</div>
