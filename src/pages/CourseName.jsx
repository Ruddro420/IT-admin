
import React, { useState } from "react";

const CourseName = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Web Development", fee: 20000 },
    { id: 2, name: "Graphic Design", fee: 15000 },
  ]);

  const [newCourse, setNewCourse] = useState({ name: "", fee: "" });
  const [editingId, setEditingId] = useState(null);

  // Add or Update Course
  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.fee) {
      alert("Please enter course name and fee");
      return;
    }

    if (editingId) {
      // Update existing
      setCourses(
        courses.map((c) =>
          c.id === editingId ? { ...c, ...newCourse, fee: parseFloat(newCourse.fee) } : c
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newId = courses.length ? courses[courses.length - 1].id + 1 : 1;
      setCourses([...courses, { id: newId, ...newCourse, fee: parseFloat(newCourse.fee) }]);
    }

    setNewCourse({ name: "", fee: "" });
  };

  // Delete Course
  const handleDelete = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Edit Course
  const handleEdit = (course) => {
    setNewCourse({ name: course.name, fee: course.fee });
    setEditingId(course.id);
  };

  return (
    <div className="w-full mt-10 bg-white shadow-sm border border-[#e6ebf1] rounded p-6 md:p-10">
      <h2 className="text-2xl font-semibold mb-6">Course Management</h2>

      {/* Input Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg flex-1"
        />
        <input
          type="number"
          placeholder="Course Fee"
          value={newCourse.fee}
          onChange={(e) => setNewCourse({ ...newCourse, fee: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg flex-1"
        />
        <button
          onClick={handleAddCourse}
          className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 border text-left">ID</th>
              <th className="px-4 py-3 border text-left">Course Name</th>
              <th className="px-4 py-3 border text-left">Course Fee (BDT)</th>
              <th className="px-4 py-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr key={course.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-3 border">{course.id}</td>
                <td className="px-4 py-3 border">{course.name}</td>
                <td className="px-4 py-3 border">{course.fee}</td>
                <td className="px-4 py-3 border flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseName;

