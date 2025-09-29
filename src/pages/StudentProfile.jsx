import React from "react";

const StudentProfile = ({ student }) => {
  // Example student data if not passed as prop
  student = student || {
    id: "STU-001",
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "017XXXXXXXX",
    dob: "2000-05-15",
    address: "123, Dhaka, Bangladesh",
    guardian: "Mr. Smith",
    guardianPhone: "018XXXXXXXX",
    course: "Web Development",
    batch: "Batch-12",
    courseFee: 20000,
    discount: 10,
    dueAmount: 5000,
    payments: [
      { date: "2025-01-15", amount: 5000, method: "Bkash" },
      { date: "2025-02-20", amount: 10000, method: "Cash" },
    ],
  };

  return (
    <div className="w-full mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-4">Student Profile</h2>

        {/* Personal & Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Personal Details</h3>
            <p><strong>ID:</strong> {student.id}</p>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Mobile:</strong> {student.mobile}</p>
            <p><strong>DOB:</strong> {student.dob}</p>
            <p><strong>Address:</strong> {student.address}</p>
            <p><strong>Guardian:</strong> {student.guardian}</p>
            <p><strong>Guardian Phone:</strong> {student.guardianPhone}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Course Details</h3>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Batch:</strong> {student.batch}</p>
            <p><strong>Course Fee:</strong> {student.courseFee} BDT</p>
            <p><strong>Discount:</strong> {student.discount}%</p>
            <p><strong>Due Amount:</strong> {student.dueAmount} BDT</p>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-lg font-medium mb-2">Payment History</h3>
          {student.payments.length === 0 ? (
            <p className="text-gray-500">No payment records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 border text-left">Date</th>
                    <th className="px-4 py-3 border text-left">Amount</th>
                    <th className="px-4 py-3 border text-left">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {student.payments.map((payment, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3 border">{payment.date}</td>
                      <td className="px-4 py-3 border">{payment.amount} BDT</td>
                      <td className="px-4 py-3 border">{payment.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
