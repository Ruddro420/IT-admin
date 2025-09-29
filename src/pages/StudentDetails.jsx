import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const StudentDetails = () => {
  // Example student data
  const [students, setStudents] = useState([
    {
      id: "STU-001",
      name: "John Doe",
      email: "john.doe@example.com",
      mobile: "017XXXXXXXX",
      course: "Web Development",
      batch: "Batch-12",
      dob: "2000-05-15",
      address: "123, Dhaka, Bangladesh",
      guardian: "Mr. Smith",
      guardianPhone: "018XXXXXXXX",
      courseFee: "20000",
      discount: "10%",
      dueAmount: "5000",
    },
    {
      id: "STU-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      mobile: "018XXXXXXXX",
      course: "Graphic Design",
      batch: "Batch-10",
      dob: "1999-12-20",
      address: "456, Chittagong, Bangladesh",
      guardian: "Mrs. Smith",
      guardianPhone: "017XXXXXXXX",
      courseFee: "15000",
      discount: "5%",
      dueAmount: "2000",
    },
    {
      id: "STU-003",
      name: "Ali Rahman",
      email: "ali.rahman@example.com",
      mobile: "019XXXXXXXX",
      course: "Web Development",
      batch: "Batch-12",
      dob: "2001-07-10",
      address: "789, Dhaka, Bangladesh",
      guardian: "Mr. Rahman",
      guardianPhone: "016XXXXXXXX",
      courseFee: "20000",
      discount: "0%",
      dueAmount: "0",
    },
  ]);

  // Filter state
  const [searchCourse, setSearchCourse] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);

  // Filter function
  const handleFilter = () => {
    const filtered = students.filter((student) => {
      return (
        student.course.toLowerCase().includes(searchCourse.toLowerCase()) &&
        student.batch.toLowerCase().includes(searchBatch.toLowerCase())
      );
    });
    setFilteredStudents(filtered);
  };

  const navigate = useNavigate()

  // View student
  // const handleView = (student) => {
  //   navigate('dasboard/sprofile')
  // };

  // Edit student
  const handleEdit = (id) => {
    alert(`Edit student with ID: ${id}`);
    // You can open a modal or navigate to edit page
  };

  // Delete student
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((student) => student.id !== id));
      setFilteredStudents(filteredStudents.filter((student) => student.id !== id));
    }
  };

  return (
    <div className="w-full mt-5">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Student Details</h3>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Course Name"
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Batch ID"
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
          />
          <button
            onClick={handleFilter}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Filter
          </button>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 border text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-3 border text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 border text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 border text-left text-sm font-medium text-gray-700">Mobile</th>
                <th className="px-4 py-3 border text-left text-sm font-medium text-gray-700">Course</th>
                <th className="px-4 py-3 border text-left text-sm font-medium text-gray-700">Batch</th>
                <th className="px-4 py-3 border text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="even:bg-gray-50 odd:bg-white">
                    <td className="px-4 py-3 border">{student.id}</td>
                    <td className="px-4 py-3 border">{student.name}</td>
                    <td className="px-4 py-3 border">{student.email}</td>
                    <td className="px-4 py-3 border">{student.mobile}</td>
                    <td className="px-4 py-3 border">{student.course}</td>
                    <td className="px-4 py-3 border">{student.batch}</td>
                    <td className="px-4 py-3 border flex gap-2">
                      <Link 
                      to='../sprofile'
                        // onClick={() => handleView(student)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleEdit(student.id)}
                        className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
