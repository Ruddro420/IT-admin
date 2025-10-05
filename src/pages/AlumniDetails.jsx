import React, { useState } from "react";

const AlumniDetails = () => {
  const [filter, setFilter] = useState({
    earning: "",
    course: "",
    batch: "",
    job: "",
  });

  const [students, setStudents] = useState([
    { id: 1, name: "Rafi Khan", phone: "01711111111", course: "Web Development", batch: "15", earning: "Yes", job: "Freelancer" },
    { id: 2, name: "Tania Akter", phone: "01822222222", course: "Graphics Design", batch: "16", earning: "No", job: "N/A" },
    { id: 3, name: "Samiul Hasan", phone: "01733333333", course: "Web Development", batch: "17", earning: "Yes", job: "Freelancer" },
    { id: 4, name: "Farhana Rahman", phone: "01744444444", course: "Digital Marketing", batch: "15", earning: "No", job: "N/A" },
    { id: 5, name: "Nazmul Huda", phone: "01755555555", course: "Web Development", batch: "16", earning: "Yes", job: "Office Job" },
    { id: 6, name: "Anika Chowdhury", phone: "01866666666", course: "Graphics Design", batch: "17", earning: "No", job: "N/A" },
    { id: 7, name: "Mahmudul Hasan", phone: "01777777777", course: "Web Development", batch: "15", earning: "Yes", job: "Freelancer" },
    { id: 8, name: "Sadia Islam", phone: "01888888888", course: "Digital Marketing", batch: "16", earning: "No", job: "N/A" },
    { id: 9, name: "Ruhul Amin", phone: "01799999999", course: "Web Development", batch: "17", earning: "Yes", job: "Office Job" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Modal state
  const [editingStudent, setEditingStudent] = useState(null);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const filteredStudents = students.filter((student) => {
    return (
      (filter.earning ? student.earning === filter.earning : true) &&
      (filter.course ? student.course === filter.course : true) &&
      (filter.batch ? student.batch === filter.batch : true) &&
      (filter.job ? student.job === filter.job : true)
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  const handleEdit = (student) => {
    setEditingStudent({ ...student }); // open modal with student data
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  const handleModalChange = (e) => {
    setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setStudents(
      students.map((s) =>
        s.id === editingStudent.id ? editingStudent : s
      )
    );
    setEditingStudent(null);
  };

  return (
    <div className="p-6 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Student Earning Details</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <select name="earning" value={filter.earning} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Earning</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="course" value={filter.course} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Course</option>
          <option value="Web Development">Web Development</option>
          <option value="Graphics Design">Graphics Design</option>
          <option value="Digital Marketing">Digital Marketing</option>
        </select>

        <select name="batch" value={filter.batch} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Batch</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
        </select>

        <select name="job" value={filter.job} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Job</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Office Job">Office Job</option>
          <option value="N/A">N/A</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Batch</th>
            <th className="border p-2">Earning</th>
            <th className="border p-2">Job</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.phone}</td>
                <td className="border p-2">{student.course}</td>
                <td className="border p-2">{student.batch}</td>
                <td className="border p-2">{student.earning}</td>
                <td className="border p-2">{student.job}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button onClick={() => handleEdit(student)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(student.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center border p-3 text-gray-500 italic">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white"}`}
          >
            Prev
          </button>

          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white"}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Student Details</h3>
            <div className="grid gap-3">
              <input
                type="text"
                name="name"
                value={editingStudent.name}
                onChange={handleModalChange}
                className="border p-2 rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="phone"
                value={editingStudent.phone}
                onChange={handleModalChange}
                className="border p-2 rounded"
                placeholder="Phone"
              />
              <select
                name="course"
                value={editingStudent.course}
                onChange={handleModalChange}
                className="border p-2 rounded"
              >
                <option>Web Development</option>
                <option>Graphics Design</option>
                <option>Digital Marketing</option>
              </select>
              <select
                name="batch"
                value={editingStudent.batch}
                onChange={handleModalChange}
                className="border p-2 rounded"
              >
                <option>15</option>
                <option>16</option>
                <option>17</option>
              </select>
              <select
                name="earning"
                value={editingStudent.earning}
                onChange={handleModalChange}
                className="border p-2 rounded"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
              <input
                type="text"
                name="job"
                value={editingStudent.job}
                onChange={handleModalChange}
                className="border p-2 rounded"
                placeholder="Job"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingStudent(null)} className="px-4 py-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDetails;
