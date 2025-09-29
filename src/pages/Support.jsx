
import React, { useState } from "react";

const Support = () => {
  const [tickets, setTickets] = useState([
    { id: 1, message: "Website not loading properly", priority: "High" },
    { id: 2, message: "Password reset issue", priority: "Medium" },
  ]);

  const [newTicket, setNewTicket] = useState({ message: "", priority: "" });
  const [editingId, setEditingId] = useState(null);

  // Add or Update Support Ticket
  const handleAddTicket = () => {
    if (!newTicket.message || !newTicket.priority) {
      alert("Please enter message and select priority");
      return;
    }

    if (editingId) {
      setTickets(
        tickets.map((t) =>
          t.id === editingId ? { ...t, ...newTicket } : t
        )
      );
      setEditingId(null);
    } else {
      const newId = tickets.length ? tickets[tickets.length - 1].id + 1 : 1;
      setTickets([...tickets, { id: newId, ...newTicket }]);
    }

    setNewTicket({ message: "", priority: "" });
  };

  // Delete Ticket
  const handleDelete = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  // Edit Ticket
  const handleEdit = (ticket) => {
    setNewTicket(ticket);
    setEditingId(ticket.id);
  };

  return (
    <div className="w-full mt-10">
      <h2 className="text-2xl font-semibold mb-6">Support Management</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
        <textarea
          rows={1}
          placeholder="Support Message"
          value={newTicket.message}
          onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg resize-none"
        />
        <select
          value={newTicket.priority}
          onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={handleAddTicket}
          className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 border text-left">ID</th>
              <th className="px-4 py-3 border text-left">Message</th>
              <th className="px-4 py-3 border text-left">Priority</th>
              <th className="px-4 py-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, idx) => (
              <tr key={ticket.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-3 border">{ticket.id}</td>
                <td className="px-4 py-3 border">{ticket.message}</td>
                <td className="px-4 py-3 border">{ticket.priority}</td>
                <td className="px-4 py-3 border flex gap-2">
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No support messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Support;

