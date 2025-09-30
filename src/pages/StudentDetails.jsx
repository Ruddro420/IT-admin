/* eslint-disable prettier/prettier */
import  { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

const StudentDetails = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentFees, setStudentFees] = useState({}); // Store fees for each student

  // Filters
  const [searchCourse, setSearchCourse] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [searchStudentId, setSearchStudentId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // Paid/Due
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Edit modal
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students, courses, batches and fees
  useEffect(() => {
    fetchStudentsAndFees();
    fetchCourses();
  }, []);

  // Fetch all students and their fees
  const fetchStudentsAndFees = async () => {
    setIsLoading(true);
    try {
      const studentsRes = await fetch(`${baseUrl}/admissions`);
      const studentsData = await studentsRes.json();
      setStudents(studentsData);
      setFilteredStudents(studentsData);

      // Fetch fees for each student
      const feesPromises = studentsData.map(async (student) => {
        try {
          // Try the new API endpoint first
          const studentDetailsRes = await fetch(`${baseUrl}/students/${student.std_id}`);
          if (studentDetailsRes.ok) {
            const studentDetails = await studentDetailsRes.json();
            return { 
              std_id: student.std_id, 
              fees: studentDetails.fees || [] 
            };
          }
          
          // Fallback to fees endpoint if student details fails
          const feesRes = await fetch(`${baseUrl}/students/${student.std_id}/fees`);
          if (feesRes.ok) {
            const feesData = await feesRes.json();
            return { std_id: student.std_id, fees: feesData };
          }
          return { std_id: student.std_id, fees: [] };
        } catch (error) {
          console.error(`Error fetching fees for ${student.std_id}:`, error);
          return { std_id: student.std_id, fees: [] };
        }
      });

      const feesResults = await Promise.all(feesPromises);
      const feesMap = {};
      feesResults.forEach(result => {
        feesMap[result.std_id] = result.fees;
      });
      
      setStudentFees(feesMap);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error loading students");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate current due for a student
  const calculateCurrentDue = (student) => {
    const initialDue = parseFloat(student.due_amount) || 0;
    const fees = studentFees[student.std_id] || [];
    const totalPaid = Array.isArray(fees) 
      ? fees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0)
      : 0;
    
    const currentDue = initialDue - totalPaid;
    return currentDue > 0 ? currentDue : 0;
  };

  // Calculate total paid for a student (only fee payments, not including admission)
  const calculateTotalPaid = (student) => {
    const fees = studentFees[student.std_id] || [];
    return Array.isArray(fees) 
      ? fees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0)
      : 0;
  };

  // Filter
  const handleFilter = () => {
    let filtered = students;

    if (searchCourse) {
      filtered = filtered.filter(
        (s) => s.course?.toLowerCase() === searchCourse.toLowerCase()
      );
    }

    if (searchBatch) {
      filtered = filtered.filter(
        (s) => s.batch_no?.toLowerCase() === searchBatch.toLowerCase()
      );
    }

    if (searchStudentId) {
      filtered = filtered.filter((s) =>
        s.std_id?.toLowerCase().includes(searchStudentId.toLowerCase())
      );
    }

    if (paymentStatus) {
      if (paymentStatus === "Paid") {
        filtered = filtered.filter((s) => calculateCurrentDue(s) === 0);
      } else if (paymentStatus === "Due") {
        filtered = filtered.filter((s) => calculateCurrentDue(s) > 0);
      }
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  // Reset filter
  const handleReset = () => {
    setSearchCourse("");
    setSearchBatch("");
    setSearchStudentId("");
    setPaymentStatus("");
    setFilteredStudents(students);
    setCurrentPage(1);
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await fetch(`${baseUrl}/admissions/${id}`, { method: "DELETE" });
      setStudents(students.filter((s) => s.id !== id));
      setFilteredStudents(filteredStudents.filter((s) => s.id !== id));
    }
  };

  // Update student after editing
  const handleUpdateStudent = (updatedStudent) => {
    setStudents(
      students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setFilteredStudents(
      filteredStudents.map((s) =>
        s.id === updatedStudent.id ? updatedStudent : s
      )
    );
    setEditingStudent(null);
  };

  // Refresh fees data
  const refreshFees = async () => {
    await fetchStudentsAndFees();
  };

  // Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Fetch courses
  const fetchCourses = useCallback(() => {
    fetch(`${baseUrl}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));
  }, [baseUrl]);

  return (
    <div className="w-full mt-5">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Student Details</h3>
          <button
            onClick={refreshFees}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 cursor-pointer"
          >
            {isLoading ? "Refreshing..." : "Refresh Fees"}
          </button>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <select
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Batch No"
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            className="p-3 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Student ID"
            value={searchStudentId}
            onChange={(e) => setSearchStudentId(e.target.value)}
            className="p-3 border rounded-lg"
          />

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="">All</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer"
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Course</th>
                  <th className="px-4 py-2 border">Batch</th>
                  <th className="px-4 py-2 border">Total Paid</th>
                  <th className="px-4 py-2 border">Current Due</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((s) => {
                    const currentDue = calculateCurrentDue(s);
                    const totalPaid = calculateTotalPaid(s);
                    
                    return (
                      <tr key={s.id} className="even:bg-gray-50">
                        <td className="px-4 py-2 border">{s.std_id}</td>
                        <td className="px-4 py-2 border">{s.full_name}</td>
                        <td className="px-4 py-2 border">{s.email}</td>
                        <td className="px-4 py-2 border">{s.course}</td>
                        <td className="px-4 py-2 border">{s.batch_no}</td>
                        <td className="px-4 py-2 border text-green-600">
                          {parseFloat(totalPaid)+parseFloat(s.course_amount)}৳
                        </td>
                        <td className={`px-4 py-2 border font-semibold ${
                          currentDue > 0 ? "text-red-600" : "text-green-600"
                        }`}>
                          {currentDue}৳
                        </td>
                        <td className="px-4 py-2 border">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            currentDue === 0 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {currentDue === 0 ? "Paid" : "Due"}
                          </span>
                        </td>
                        <td className="px-4 py-2 border flex gap-2">
                          <Link
                            to={`/dashboard/sprofile/${s.std_id}`}
                            className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer text-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => setEditingStudent(s)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdate={handleUpdateStudent}
        />
      )}
    </div>
  );
};

export default StudentDetails;


const EditStudentModal = ({ student, isOpen, onClose, onUpdate }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    fullName: student?.full_name || "",
    mobile: student?.mobile || "",
    altNumber: student?.alt_number || "",
    email: student?.email || "",
    presentAddress: student?.present_address || "",
    permanentAddress: student?.permanent_address || "",
    dob: student?.dob || student?.date_of_birth || "",
    gender: student?.gender || "",
    batchNo: student?.batch_no || "",
    nid: student?.nid || "",
    date: student?.date || student?.admission_date || "",
    guardianName: student?.guardian_name || "",
    guardianPhone: student?.guardian_phone || "",
    courseAmount: student?.course_amount || "",
    discountAmount: student?.discount_amount || "",
    paymentType: student?.payment_type || "",
    dueAmount: student?.due_amount || "",
    course: student?.course || "",
    // add other fields as needed
  });
  const [courses, setCourses] = useState([]);

  // Prefill data whenever student changes
  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.full_name || "",
        mobile: student.mobile || "",
        altNumber: student.alt_number || "",
        email: student.email || "",
        presentAddress: student.present_address || "",
        permanentAddress: student.permanent_address || "",
        dob: student.dob || student.date_of_birth || "",
        gender: student.gender || "",
        batchNo: student.batch_no || "",
        nid: student.nid || "",
        date: student.date || student.admission_date || "",
        guardianName: student.guardian_name || "",
        guardianPhone: student.guardian_phone || "",
        courseAmount: student.course_amount || "",
        discountAmount: student.discount_amount || "",
        paymentType: student.payment_type || "",
        dueAmount: student.due_amount || "",
        course: student.course || "",
        // add other fields as needed
      });
    }
  }, [student]);

  // Fetch courses
  const fetchCourses = useCallback(() => {
    fetch(`${baseUrl}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));
  }, [baseUrl]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map camelCase formData to snake_case for backend
    const mappedData = {
      full_name: formData.fullName,
      mobile: formData.mobile,
      alt_number: formData.altNumber,
      email: formData.email,
      present_address: formData.presentAddress,
      permanent_address: formData.permanentAddress,
      dob: formData.dob,
      gender: formData.gender,
      batch_no: formData.batchNo,
      nid: formData.nid,
      date: formData.date,
      guardian_name: formData.guardianName,
      guardian_phone: formData.guardianPhone,
      course_amount: formData.courseAmount,
      discount_amount: formData.discountAmount,
      payment_type: formData.paymentType,
      due_amount: formData.dueAmount,
      course: formData.course,
      // add other fields as needed
    };

    fetch(`${baseUrl}/admissions/${student.id}`, {
      method: "PUT", // Update existing student
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mappedData)
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Student updated successfully!");
        onUpdate(data); // update parent state
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error updating student");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block text-sm font-medium mb-1">Full Name
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-2 border rounded w-full"
            />
          </label>
          <label className="block text-sm font-medium mb-1">Mobile Number
            <input
              type="tel"
              name="mobile"
              value={formData.mobile || ""}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="p-2 border rounded w-full"
            />
          </label>
          <label className="block text-sm font-medium mb-1">Alt Number
            <input
              type="text"
              name="altNumber"
              value={formData.altNumber || ""}
              onChange={handleChange}
              placeholder="Alt Number"
              className="p-2 border rounded w-full"
            />
          </label>
          <label className="block text-sm font-medium mb-1">Email
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 border rounded w-full"
            />
          </label>
          <label className="block text-sm font-medium mb-1 col-span-1 md:col-span-3">Present Address
            <textarea
              name="presentAddress"
              value={formData.presentAddress || ""}
              onChange={handleChange}
              placeholder="Present Address"
              className="p-2 border rounded w-full"
            />
          </label>
          <label className="block text-sm font-medium mb-1 col-span-1 md:col-span-3">Permanent Address
            <textarea
              name="permanentAddress"
              value={formData.permanentAddress || ""}
              onChange={handleChange}
              placeholder="Permanent Address"
              className="p-2 border rounded w-full"
            />
          </label>
          <label className="block text-sm font-medium mb-1">Date of Birth
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.slice(0,10) : ""}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </label>
          <label className="block text-sm font-medium mb-1">Gender
            <select name="gender" value={formData.gender || ""} onChange={handleChange} className="p-2 border rounded w-full">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="block text-sm font-medium mb-1">NID
            <input type="text" name="nid" value={formData.nid || ""} onChange={handleChange} placeholder="NID" className="p-2 border rounded w-full"/>
          </label>
          <label className="block text-sm font-medium mb-1">Course
            <select name="course" value={formData.course || ""} onChange={handleChange} className="p-2 border rounded w-full">
              <option value="">Select Course</option>
              {courses.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium mb-1">Batch No
            <input type="text" name="batchNo" value={formData.batchNo || ""} onChange={handleChange} placeholder="Batch No" className="p-2 border rounded w-full"/>
          </label>
          <label className="block text-sm font-medium mb-1">Admission Date
            <input type="date" name="date" value={formData.date ? formData.date.slice(0,10) : ""} onChange={handleChange} className="p-2 border rounded w-full"/>
          </label>
          <label className="block text-sm font-medium mb-1">Guardian Name
            <input type="text" name="guardianName" value={formData.guardianName || ""} onChange={handleChange} placeholder="Guardian Name" className="p-2 border rounded w-full"/>
          </label>
          <label className="block text-sm font-medium mb-1">Guardian Phone
            <input type="tel" name="guardianPhone" value={formData.guardianPhone || ""} onChange={handleChange} placeholder="Guardian Phone" className="p-2 border rounded w-full"/>
          </label>
          <label className="block text-sm font-medium mb-1">Course Amount
            <input type="number" name="courseAmount" value={formData.courseAmount || ""} onChange={handleChange} placeholder="Course Amount" className="p-2 border rounded w-full"/>
          </label>
          <label className="block text-sm font-medium mb-1">Discount
            <input type="number" name="discountAmount" value={formData.discountAmount || ""} onChange={handleChange} placeholder="Discount" className="p-2 border rounded w-full"/>
          </label>
          <label className="block text-sm font-medium mb-1">Payment Type
            <select name="paymentType" value={formData.paymentType || ""} onChange={handleChange} className="p-2 border rounded w-full">
              <option value="">Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="Bkash">Bkash</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="block text-sm font-medium mb-1">Due Amount
            <input type="number" name="dueAmount" value={formData.dueAmount || ""} onChange={handleChange} placeholder="Due Amount" className="p-2 border rounded w-full"/>
          </label>
          <div className="col-span-1 md:col-span-3 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// export default EditStudentModal;