/* eslint-disable prettier/prettier */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CourseName = () => {
  const [newCourse, setNewCourse] = useState({ name: '', fee: '' });
  const [editingId, setEditingId] = useState(null);
  
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalCourses, setTotalCourses] = useState(0);
  
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch courses from server
  const fetchCourses = () => {
    fetch(`${baseUrl}/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setTotalCourses(data.length);
        toast.success('Courses loaded successfully');
      })
      .catch((error) => {
        toast.error('Error loading courses');
        console.error('Error fetching courses:', error);
      });
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Add or Update Course
  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.fee) {
      toast.error('Please enter course name and fee');
      return;
    }

    if (editingId) {
      // Update existing
      fetch(`${baseUrl}/courses/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCourse.name,
          fee: parseFloat(newCourse.fee)
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Course updated:', data);
          toast.success('Course updated successfully');
          setEditingId(null);
          fetchCourses();
        })
        .catch((error) => {
          toast.error('Error updating course');
          console.error('Error updating course:', error);
        });
    } else {
      // Add new
      fetch(`${baseUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCourse.name,
          fee: parseFloat(newCourse.fee)
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Course created:', data);
          toast.success('Course created successfully');
          fetchCourses();
        })
        .catch((error) => {
          toast.error('Error creating course');
          console.error('Error creating course:', error);
        });
    }

    setNewCourse({ name: '', fee: '' });
  };

  // Delete Course
  const handleDelete = (id) => {
    fetch(`${baseUrl}/courses/${id}`, {
      method: 'DELETE'
    }).then((res) => {
      if (res.ok) {
        setCourses(courses.filter((course) => course.id !== id));
        toast.success('Course deleted successfully');
        // Reset to first page if current page becomes empty
        if (currentPage > 1 && courses.length % itemsPerPage === 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error('Error deleting course');
      }
    });
  };

  // Edit Course
  const handleEdit = (course) => {
    setNewCourse({ name: course.name, fee: course.fee });
    setEditingId(course.id);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Items per page change handler
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
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
          className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-2 border border-gray-300 rounded text-sm cursor-pointer"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-600">
            entries
          </span>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, courses.length)} of {courses.length} entries
        </div>
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
            {currentCourses.map((course, idx) => (
              <tr key={course.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3 border">{course.id}</td>
                <td className="px-4 py-3 border">{course.name}</td>
                <td className="px-4 py-3 border">{course.fee}</td>
                <td className="px-4 py-3 border flex gap-2">
                  <button 
                    onClick={() => handleEdit(course)} 
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)} 
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
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

      {/* Pagination Controls */}
      {courses.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex gap-2">
            {/* Previous Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded border ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-2 rounded border ${
                  currentPage === number
                    ? 'bg-blue-500 text-white cursor-pointer'
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {number}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseName;