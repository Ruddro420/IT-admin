/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import AccountsReport from "../components/AccountsReport";
import {  toast } from "react-hot-toast";

const Accounts = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    type: "Income",
    purpose: "",
    date: "",
    amount: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const API_URL = import.meta.env.VITE_BASE_URL;

  // Fetch data from API on mount
  useEffect(() => {
    fetch(`${API_URL}/accounts`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (Array.isArray(data)) {
          setEntries(data);
        } else if (data && Array.isArray(data.data)) {
          setEntries(data.data);
        } else {
          setEntries([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to load accounts");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Edit (PUT)
      const updatedEntry = { ...form };
      const id = entries[editIndex]._id || entries[editIndex].id;
      try {
        await fetch(`${API_URL}/accounts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEntry),
        });
        const updated = [...entries];
        updated[editIndex] = { ...updatedEntry, _id: id };
        setEntries(updated);
        setEditIndex(null);
        toast.success("Entry updated successfully");
      } catch (err) {
        console.error("Update error:", err);
        toast.error("Failed to update entry");
      }
    } else {
      // Add (POST)
      try {
        const res = await fetch(`${API_URL}/accounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const newEntry = await res.json();
        setEntries((prev) => [...prev, newEntry]);
        toast.success("Entry added successfully");
      } catch (err) {
        console.error("Add error:", err);
        toast.error("Failed to add entry");
      }
    }
    setForm({ type: "Income", purpose: "", date: "", amount: "" });
  };

  const handleDelete = async (index) => {
    const actualIndex = (currentPage - 1) * recordsPerPage + index;
    const id = entries[actualIndex]._id || entries[actualIndex].id;
    try {
      const res = await fetch(`${API_URL}/accounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries(entries.filter((_, i) => i !== actualIndex));
        toast.success("Entry deleted successfully");
      } else {
        toast.error("Failed to delete entry");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete entry");
    }
  };

  const handleEdit = (index) => {
    const actualIndex = (currentPage - 1) * recordsPerPage + index;
    setForm(entries[actualIndex]);
    setEditIndex(actualIndex);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = Array.isArray(entries)
    ? entries.slice(indexOfFirstRecord, indexOfLastRecord)
    : [];
  const totalPages = Math.ceil(entries.length / recordsPerPage);

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Accounts</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
      >
        {/* Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {/* Purpose */}
        <input
          type="text"
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          placeholder="Purpose"
          className="border rounded p-2"
          required
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border rounded p-2"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded p-2"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Purpose</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((entry, index) => (
                <tr key={index} className="text-center border-t">
                  <td className="py-2 px-4 border">{entry.type}</td>
                  <td className="py-2 px-4 border">{entry.purpose}</td>
                  <td className="py-2 px-4 border">{entry.date}</td>
                  <td className="py-2 px-4 border">{entry.amount}</td>
                  <td className="py-2 px-4 border flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-4 text-gray-500 text-center border"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {entries.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <div className="space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Report Component */}
      <div className="mt-10">
        <AccountsReport />
      </div>
    </div>
  );
};

export default Accounts;
