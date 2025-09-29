import React, { useState } from "react";

const Fees = () => {
  // Example student data
  const [students, setStudents] = useState([
    {
      id: "STU-001",
      name: "John Doe",
      mobile: "017XXXXXXXX",
      course: "Web Development",
      batch: "Batch-12",
      courseFee: 20000,
      discount: 10,
      paid: 15000,
      dueAmount: 5000,
      payments: [
        { date: "2025-01-15", amount: 5000, purpose: "Monthly Fee" },
        { date: "2025-02-20", amount: 10000, purpose: "Monthly Fee" },
      ],
    },
    {
      id: "STU-002",
      name: "Jane Smith",
      mobile: "018XXXXXXXX",
      course: "Graphic Design",
      batch: "Batch-10",
      courseFee: 15000,
      discount: 5,
      paid: 13000,
      dueAmount: 2000,
      payments: [
        { date: "2025-01-10", amount: 7000, purpose: "Monthly Fee" },
        { date: "2025-02-15", amount: 6000, purpose: "Monthly Fee" },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Add fees state
  const [newFee, setNewFee] = useState({ amount: "", purpose: "" });

  // Search student
  const handleSearch = () => {
    const student = students.find(
      (s) =>
        s.id.toLowerCase() === searchTerm.toLowerCase() ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mobile.includes(searchTerm)
    );
    if (student) {
      setSelectedStudent(student);
    } else {
      alert("Student not found");
      setSelectedStudent(null);
    }
  };

  // Add new fee
  const handleAddFee = () => {
    if (!newFee.amount || !newFee.purpose) {
      alert("Please enter fee amount and purpose");
      return;
    }

    const updatedStudent = {
      ...selectedStudent,
      paid: selectedStudent.paid + parseFloat(newFee.amount),
      dueAmount: selectedStudent.courseFee - selectedStudent.discount - (selectedStudent.paid + parseFloat(newFee.amount)),
      payments: [
        ...selectedStudent.payments,
        { date: new Date().toISOString().split("T")[0], amount: parseFloat(newFee.amount), purpose: newFee.purpose },
      ],
    };

    setStudents(
      students.map((s) => (s.id === selectedStudent.id ? updatedStudent : s))
    );
    setSelectedStudent(updatedStudent);
    setNewFee({ amount: "", purpose: "" });
    alert("Fee added successfully");
  };

  return (
    <div className="w-full mt-10">
      <h2 className="text-2xl font-semibold mb-6">Fees Management</h2>

      {/* Search Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by ID / Name / Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* Student Details */}
      {selectedStudent && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Student Details</h3>

          {/* Personal & Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p><strong>ID:</strong> {selectedStudent.id}</p>
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Mobile:</strong> {selectedStudent.mobile}</p>
              <p><strong>Course:</strong> {selectedStudent.course}</p>
              <p><strong>Batch:</strong> {selectedStudent.batch}</p>
            </div>
            <div>
              <p><strong>Course Fee:</strong> {selectedStudent.courseFee} BDT</p>
              <p><strong>Discount:</strong> {selectedStudent.discount} BDT</p>
              <p><strong>Paid:</strong> {selectedStudent.paid} BDT</p>
              <p><strong>Due Amount:</strong> {selectedStudent.dueAmount} BDT</p>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Payment History</h4>
            {selectedStudent.payments.length === 0 ? (
              <p className="text-gray-500">No payment records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 border text-left">Date</th>
                      <th className="px-4 py-3 border text-left">Amount</th>
                      <th className="px-4 py-3 border text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.payments.map((p, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-3 border">{p.date}</td>
                        <td className="px-4 py-3 border">{p.amount} BDT</td>
                        <td className="px-4 py-3 border">{p.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add Fees Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-2">Add Fees</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Amount"
                value={newFee.amount}
                onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Purpose"
                value={newFee.purpose}
                onChange={(e) => setNewFee({ ...newFee, purpose: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              />
              <button
                onClick={handleAddFee}
                className="px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Fee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
