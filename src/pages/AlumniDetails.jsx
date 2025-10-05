/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AlumniDetails = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [courses, setCourses] = useState([]);
  const [alumniDetails, setAlumniDetails] = useState([]);
  const [filter, setFilter] = useState({
    earning: '',
    course: '',
    batch: '',
    job: ''
  });

  const fetchCourses = useCallback(() => {
    fetch(`${baseUrl}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, [baseUrl]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const [currentPage, setCurrentPage] = useState(1);
  const alumniPerPage = 5;
  const [editingAlumni, setEditingAlumni] = useState(null);

  /** ✅ Fetch all alumni */
  const fetchAlumniDetails = useCallback(() => {
    fetch(`${baseUrl}/alumni`)
      .then((res) => res.json())
      .then((data) => {
        setAlumniDetails(data);
      })
      .catch(() => toast.error('Failed to load alumni data'));
  }, [baseUrl]);

  useEffect(() => {
    fetchAlumniDetails();
  }, [fetchAlumniDetails]);

  /** ✅ Filter handler */
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  /** ✅ Filter logic */
  const filteredAlumni = alumniDetails.filter((item) => {
    return (
      (filter.earning ? item.earning === filter.earning : true) &&
      (filter.course ? item.course === filter.course : true) &&
      (filter.batch ? item.batchNo === filter.batch : true) &&
      (filter.job ? item.job === filter.job : true)
    );
  });

  /** ✅ Pagination setup */
  const totalPages = Math.ceil(filteredAlumni.length / alumniPerPage);
  const startIndex = (currentPage - 1) * alumniPerPage;
  const currentAlumni = filteredAlumni.slice(startIndex, startIndex + alumniPerPage);

  /** ✅ Edit Modal */
  const handleEdit = (alumni) => {
    setEditingAlumni({ ...alumni });
  };

  const handleModalChange = (e) => {
    setEditingAlumni({ ...editingAlumni, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch(`${baseUrl}/alumni/${editingAlumni.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingAlumni)
    })
      .then((res) => res.json())
      .then(() => {
        toast.success('Record updated successfully!');
        setEditingAlumni(null);
        fetchAlumniDetails();
      })
      .catch(() => toast.error('Failed to update record'));
  };

  /** ✅ Delete Alumni */
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      fetch(`${baseUrl}/alumni/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (res.ok) {
            toast.success('Deleted successfully!');
            setAlumniDetails((prev) => prev.filter((a) => a.id !== id));
          } else {
            toast.error('Failed to delete record');
          }
        })
        .catch(() => toast.error('Server error while deleting'));
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Alumni Earning Details</h2>

      {/* ✅ Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <select name="earning" value={filter.earning} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Earning</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="course" value={filter.course} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Course</option>
          {[...new Set(alumniDetails.map((a) => a.course))].map((course) => (
            <option key={course}>{course}</option>
          ))}
        </select>

        <select name="batch" value={filter.batch} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Batch</option>
          {[...new Set(alumniDetails.map((a) => a.batchNo))].map((batch) => (
            <option key={batch}>{batch}</option>
          ))}
        </select>

        <select name="job" value={filter.job} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Filter by Job</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* ✅ Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Batch</th>
            <th className="border p-2">Earning</th>
            <th className="border p-2">Job</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAlumni.length > 0 ? (
            currentAlumni.map((alumni) => (
              <tr key={alumni.id}>
                <td className="border p-2">{alumni.fullName}</td>
                <td className="border p-2">{alumni.mobile}</td>
                <td className="border p-2">{alumni.course}</td>
                <td className="border p-2">{alumni.batchNo}</td>
                <td className="border p-2">{alumni.earning}</td>
                <td className="border p-2">{alumni.job}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button onClick={() => handleEdit(alumni)} className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(alumni.id)} className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer">
                    Delete
                  </button>
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

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'}`}
          >
            Prev
          </button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Full Editable Modal */}
      {editingAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Alumni Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  name="fullName"
                  value={editingAlumni.fullName || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Full Name"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <input
                  name="mobile"
                  value={editingAlumni.mobile || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Mobile Number"
                />
              </div>

              {/* Alternate Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Alternate Number</label>
                <input
                  name="altNumber"
                  value={editingAlumni.altNumber || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Alternate Number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  value={editingAlumni.email || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Email"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  name="address"
                  value={editingAlumni.address || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Address"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={editingAlumni.dob || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select name="gender" value={editingAlumni.gender || ''} onChange={handleModalChange} className="border p-2 rounded w-full">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Course */}
              {/* <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <input
                  name="course"
                  value={editingAlumni.course || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Course Name"
                />
              </div> */}

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Course *</label>
                <select
                  name="course"
                  value={editingAlumni.course || ""}
                  onChange={handleModalChange}
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch No */}
              <div>
                <label className="block text-sm font-medium mb-1">Batch No</label>
                <input
                  name="batchNo"
                  value={editingAlumni.batchNo || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Batch No"
                />
              </div>

              {/* Earning */}
              <div>
                <label className="block text-sm font-medium mb-1">Earning</label>
                <select
                  name="earning"
                  value={editingAlumni.earning || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Finished Course */}
              <div>
                <label className="block text-sm font-medium mb-1">Finished Course</label>
                <select
                  name="finishedCourse"
                  value={editingAlumni.finishedCourse || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Earning Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Earning Amount</label>
                <input
                  name="earningAmount"
                  value={editingAlumni.earningAmount || ''}
                  onChange={handleModalChange}
                  className="border p-2 rounded w-full"
                  placeholder="Earning Amount"
                />
              </div>

              {/* Job */}
              <div>
                <label className="block text-sm font-medium mb-1">Job</label>
                <select name="job" value={editingAlumni.job || ''} onChange={handleModalChange} className="border p-2 rounded w-full">
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingAlumni(null)} className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDetails;
