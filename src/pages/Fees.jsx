/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Fees = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newFee, setNewFee] = useState({ amount: "", purpose: "", payment_type: "cash" });
  const [editingFee, setEditingFee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all students on component mount (for search suggestions)
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch all students from admissions API
  const fetchStudents = () => {
    setIsLoading(true);
    fetch(`${baseUrl}/admissions`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        toast.error("Error loading students");
        setIsLoading(false);
      });
  };

  // Fetch student details and fees using the new API
  const fetchStudentDetails = (stdId) => {
    setIsLoading(true);
    fetch(`${baseUrl}/students/${stdId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Student not found");
        }
        return res.json();
      })
      .then((studentData) => {
        // Calculate paid amount and due amount
        const totalPaid = Array.isArray(studentData.fees)
          ? studentData.fees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0)
          : 0;

        const initialDue = parseFloat(studentData.due_amount) || 0;

        // Calculate current due amount
        const currentDue = initialDue - totalPaid;

        setSelectedStudent({
          ...studentData,
          paid: totalPaid,
          dueAmount: currentDue > 0 ? currentDue : 0,
          payments: Array.isArray(studentData.fees) ? studentData.fees : []
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
        toast.error("Student not found");
        setSelectedStudent(null);
        setIsLoading(false);
      });
  };

  // Search student
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter search term");
      return;
    }

    // First try to find student in local cache for immediate feedback
    const student = students.find(
      (s) =>
        s.std_id?.toLowerCase() === searchTerm.toLowerCase() ||
        s.id?.toString() === searchTerm ||
        s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mobile?.includes(searchTerm)
    );

    if (student && student.std_id) {
      // Use the dedicated student API with std_id
      fetchStudentDetails(student.std_id);
    } else {
      // If not found in local cache, try searching directly with the search term as std_id
      fetchStudentDetails(searchTerm);
    }
  };

  // Add new fee
  const handleAddFee = () => {
    if (!newFee.amount || !newFee.purpose) {
      toast.error("Please enter fee amount and purpose");
      return;
    }

    if (!selectedStudent) {
      toast.error("No student selected");
      return;
    }

    // Check if due amount is 0 or negative
    if (selectedStudent.dueAmount <= 0) {
      toast.error("Already Paid! No due amount remaining.");
      return;
    }

    const feeAmount = parseFloat(newFee.amount);

    // Check if the payment amount exceeds the due amount
    if (feeAmount > selectedStudent.dueAmount) {
      toast.error(`Payment amount exceeds due amount! Maximum allowed: ${selectedStudent.dueAmount} BDT`);
      return;
    }

    const feeData = {
      amount: feeAmount,
      purpose: newFee.purpose,
      payment_type: newFee.payment_type,
      date: new Date().toISOString().split("T")[0],
      std_id: selectedStudent.std_id
    };

    fetch(`${baseUrl}/students/${selectedStudent.std_id}/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feeData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add fee");
        }
        return res.json();
      })
      .then((data) => {
        toast.success("Fee added successfully");
        setNewFee({ amount: "", purpose: "", payment_type: "cash" });
        // Refresh student data to get updated fees
        fetchStudentDetails(selectedStudent.std_id);
      })
      .catch((error) => {
        console.error("Error adding fee:", error);
        toast.error("Error adding fee");
      });
  };

  // Update fee
  const handleUpdateFee = () => {
    if (!editingFee || !newFee.amount || !newFee.purpose) {
      toast.error("Please enter fee amount and purpose");
      return;
    }

    // For update, we don't check due amount since we're modifying existing payment
    const updatedFeeData = {
      amount: parseFloat(newFee.amount),
      purpose: newFee.purpose,
      payment_type: newFee.payment_type,
      date: editingFee.date || new Date().toISOString().split("T")[0]
    };

    fetch(`${baseUrl}/fees/${editingFee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFeeData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update fee");
        }
        return res.json();
      })
      .then((data) => {
        toast.success("Fee updated successfully");
        setEditingFee(null);
        setNewFee({ amount: "", purpose: "", payment_type: "cash" });
        if (selectedStudent) {
          fetchStudentDetails(selectedStudent.std_id);
        }
      })
      .catch((error) => {
        console.error("Error updating fee:", error);
        toast.error("Error updating fee");
      });
  };

  // Delete fee
  const handleDeleteFee = (feeId) => {
    if (!confirm("Are you sure you want to delete this fee record?")) {
      return;
    }

    fetch(`${baseUrl}/fees/${feeId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Fee deleted successfully");
          if (selectedStudent) {
            fetchStudentDetails(selectedStudent.std_id);
          }
        } else {
          throw new Error("Failed to delete fee");
        }
      })
      .catch((error) => {
        console.error("Error deleting fee:", error);
        toast.error("Error deleting fee");
      });
  };

  // Start editing fee
  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setNewFee({
      amount: fee.amount.toString(),
      purpose: fee.purpose,
      payment_type: fee.payment_type || "cash"
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingFee(null);
    setNewFee({ amount: "", purpose: "", payment_type: "cash" });
  };

  // Handle form submit (add or update)
  const handleSubmitFee = () => {
    if (editingFee) {
      handleUpdateFee();
    } else {
      handleAddFee();
    }
  };

  return (
    <div className="w-full mt-10">
      <h2 className="text-2xl font-semibold mb-6">Fees Management</h2>

      {/* Search Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Student ID / Name / Mobile"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 cursor-pointer"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Student Details */}
      {selectedStudent && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Student Details</h3>

          {/* Personal & Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div>
              <h3 className="text-lg font-medium mb-3">Personal Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">ID</td>
                      <td className="px-4 py-2 border">{selectedStudent.std_id}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Name</td>
                      <td className="px-4 py-2 border">{selectedStudent.full_name}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Email</td>
                      <td className="px-4 py-2 border">{selectedStudent.email}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Mobile</td>
                      <td className="px-4 py-2 border">{selectedStudent.mobile}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">DOB</td>
                      <td className="px-4 py-2 border">{selectedStudent.dob}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">
                        Present Address
                      </td>
                      <td className="px-4 py-2 border">
                        {selectedStudent.present_address}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">
                        Permanent Address
                      </td>
                      <td className="px-4 py-2 border">
                        {selectedStudent.permanent_address}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Guardian</td>
                      <td className="px-4 py-2 border">{selectedStudent.guardian_name}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">
                        Guardian Phone
                      </td>
                      <td className="px-4 py-2 border">
                        {selectedStudent.guardian_phone}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div>
              <p><strong>Student ID:</strong> {selectedStudent.std_id}</p>
              <p><strong>Name:</strong> {selectedStudent.full_name}</p>
              <p><strong>Mobile:</strong> {selectedStudent.mobile}</p>
              <p><strong>Course:</strong> {selectedStudent.course}</p>
              <p><strong>Batch:</strong> {selectedStudent.batch_no}</p>
            </div> */}


            <div>
              <h3 className="text-lg font-medium mb-3">Course Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Course</td>
                      <td className="px-4 py-2 border">{selectedStudent.course}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Batch</td>
                      <td className="px-4 py-2 border">{selectedStudent.batch_no}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">
                        Admission Date
                      </td>
                      <td className="px-4 py-2 border">{selectedStudent.admission_date}</td>
                    </tr>
                    {/* <tr>
                                        <td className="px-4 py-2 border font-semibold">Course Fee</td>
                                        <td className="px-4 py-2 border">
                                            {courseFee ? `${courseFee} BDT` : "Loading..."}
                                        </td>
                                    </tr> */}
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Discount</td>
                      <td className="px-4 py-2 border">
                        {selectedStudent.discount_amount} BDT
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">
                        Admission Payment Type
                      </td>
                      <td className="px-4 py-2 border">{selectedStudent.payment_type}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">
                        Total Paid
                      </td>
                      <td className="px-4 py-2 border">
                        <strong>Total Paid:</strong> {parseFloat(selectedStudent.paid) + parseFloat(selectedStudent.course_amount)}৳
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-semibold">Due Amount</td>
                      <td className="px-4 py-2 border text-red-600 font-semibold">
                        <strong className={selectedStudent.dueAmount > 0 ? "text-red-600" : "text-green-600"}>
                          Due Amount: {selectedStudent.dueAmount}৳
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Admission Payment */}
          <div className="mb-10">
            <h3 className="text-lg font-medium mb-3">Admission Payment</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-4 py-3 border text-left">Date</th>
                    <th className="px-4 py-3 border text-left">Amount</th>
                    <th className="px-4 py-3 border text-left">Purpose</th>
                    <th className="px-4 py-3 border text-left">Payment Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

                    <td className="px-4 py-3 border">
                      {selectedStudent.admission_date}
                    </td>
                    <td className="px-4 py-3 border">
                      {selectedStudent.course_amount} BDT
                    </td>
                    <td className="px-4 py-3 border">
                      Admission
                    </td>
                    <td className="px-4 py-3 border">{selectedStudent.payment_type}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Payment History</h4>
              {editingFee && (
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {selectedStudent.payments.length === 0 ? (
              <p className="text-gray-500">No payment records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 border text-left">Date</th>
                      <th className="px-4 py-3 border text-left">Amount (BDT)</th>
                      <th className="px-4 py-3 border text-left">Purpose</th>
                      <th className="px-4 py-3 border text-left">Payment Type</th>
                      <th className="px-4 py-3 border text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.payments.map((payment, idx) => (
                      <tr key={payment.id || idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-3 border">{payment.date}</td>
                        <td className="px-4 py-3 border">{payment.amount}</td>
                        <td className="px-4 py-3 border">{payment.purpose}</td>
                        <td className="px-4 py-3 border capitalize">{payment.payment_type}</td>
                        <td className="px-4 py-3 border">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditFee(payment)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFee(payment.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add/Edit Fees Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-2">
              {editingFee ? "Edit Fee" : "Add New Fee"}
            </h4>
            {!editingFee && selectedStudent.dueAmount <= 0 && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <strong>Fully Paid!</strong> No due amount remaining. You cannot add new fees.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Amount (BDT)"
                value={newFee.amount}
                onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                disabled={!editingFee && selectedStudent.dueAmount <= 0}
              />
              <input
                type="text"
                placeholder="Purpose"
                value={newFee.purpose}
                onChange={(e) => setNewFee({ ...newFee, purpose: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                disabled={!editingFee && selectedStudent.dueAmount <= 0}
              />
              <select
                value={newFee.payment_type}
                onChange={(e) => setNewFee({ ...newFee, payment_type: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                disabled={!editingFee && selectedStudent.dueAmount <= 0}
              >
                <option value="cash">Cash</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="others">Others</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitFee}
                  disabled={!editingFee && selectedStudent.dueAmount <= 0}
                  className={`flex-1 px-5 py-3 rounded-lg cursor-pointer ${!editingFee && selectedStudent.dueAmount <= 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                  {editingFee ? "Update Fee" : "Add Fee"}
                </button>
                {editingFee && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            {!editingFee && selectedStudent.dueAmount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Maximum allowed amount: {selectedStudent.dueAmount} BDT
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

export default Fees;