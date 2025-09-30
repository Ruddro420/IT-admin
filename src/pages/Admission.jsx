/* eslint-disable prettier/prettier */

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
// Make sure to import toast from 'react-toastify' and fetchVisitors if needed
// import { toast } from 'react-toastify';
// import { fetchVisitors } from '...';

const Admission = () => {
  const [courses, setCourses] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [due, setDue] = useState(0);

  // Automatically calculate due amount
  useEffect(() => {
    if (selectedCourse && payAmount !== "" && discount !== "") {
      setDue(parseInt(selectedCourse.fee || 0) - (parseInt(payAmount || 0) + parseInt(discount || 0)));
    } else {
      setDue(0);
    }
  }, [selectedCourse, payAmount, discount]);

  console.log("Due:",parseInt(selectedCourse?.fee)-(parseInt(payAmount)+parseInt(discount)));

  //fetch courses from server (mocked here)
  const fetchCourses = useCallback(() => {
    fetch(`${baseUrl}/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        // i?f (typeof toast !== 'undefined') toast.success('Courses loaded successfully');
      })
      .catch((error) => {
        if (typeof toast !== 'undefined') toast.error('Error loading courses');
        console.error('Error fetching courses:', error);
      });
  }, [baseUrl]);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    course: '',
    altNumber: '',
    email: '',
    presentAddress: '',
    permanentAddress: '',
    dob: '',
    gender: '',
    batchNo: '',
    nid: '',
    date: '',
    guardianName: '',
    guardianPhone: '',
    courseAmount: '',
    discountAmount: '',
    paymentType: '',
    dueAmount: ''
  });
  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = (e) => {
      e.preventDefault();


      const newStudent = {
        full_name: formData.fullName,
        mobile: formData.mobile,
        course: selectedCourse.name,
        alt_number: formData.altNumber,
        email: formData.email,
        present_address: formData.presentAddress,
        permanent_address: formData.permanentAddress,
        dob: formData.dob,
        gender: formData.gender,
        nid: formData.nid,
        batch_no: formData.batchNo,
        admission_date: new Date().toISOString().split('T')[0],
        guardian_name: formData.guardianName,
        guardian_phone: formData.guardianPhone,
        course_amount: payAmount,
        discount_amount: discount,
        payment_type: formData.paymentType,
        due_amount: due
      };

      console.log(newStudent);

      //add visitor to database (mocked here)
      // setVisitors([...visitors, newVisitor]);
      fetch(`${baseUrl}/admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Student added:', data);
          toast.success('Student added successfully');
        })
        .catch((error) => {
          toast.error('Error adding Student');
          console.error('Error adding Student:', error);
        });


    };


  return (
    <div>
      {/* Input Field */}
      <main className="w-full mt-5">
        <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-[#e6ebf1] rounded p-6 md:p-10" >
          <header className="mb-6">
            <h5 className="text-xl md:text-xl font-semibold">Admission Form</h5>
            <p className="text-gray-500 mt-1">Please fill in the details below. All fields marked with * are required.</p>
            <br />
            <hr />
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                required
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
              <input
                required
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                pattern="[0-9]{10,15}"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Alternative Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Alternative Number</label>
              <input
                type="tel"
                name="altNumber"
                value={formData.altNumber}
                onChange={handleChange}
                pattern="[0-9]{10,15}"
                placeholder="01XXXXXXXXX"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Present Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Present Address *</label>
              <textarea
                required
                name="presentAddress"
                rows="2"
                value={formData.presentAddress}
                onChange={handleChange}
                placeholder="House/Street/Area, City"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              ></textarea>
            </div>

            {/* Permanent Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
              <textarea
                name="permanentAddress"
                rows="2"
                value={formData.permanentAddress}
                onChange={handleChange}
                placeholder="House/Street/Area, City"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              ></textarea>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
              <input
                required
                type="date"
                value={formData.dob}
                onChange={handleChange}
                name="dob"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender *</label>
              <select
                value={formData.gender}
                onChange={handleChange}
                required
                name="gender"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* NID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">NID</label>
              <input
                type="text"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
                placeholder="National ID number"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>
            {/* Course */}

            <div>
              <label className="block text-sm font-medium text-gray-700">Course *</label>
              <select
                name="course"
                value={selectedCourse?.name || ''}
                onChange={(e) => {setSelectedCourse(courses.find(course => course.name === e.target.value))}}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name} - {course.fee}৳
                  </option>
                ))}
              </select>
            </div>

            {/* Batch No */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch No *</label>
              <input
                required
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                placeholder="e.g. Batch 01"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/*Admission Date*/}
            <div>
              <label className="block text-sm font-medium text-gray-700">Admission Date *</label>
              <input
                required
                type="date"
                name="date"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Name *</label>
              <input
                required
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="Father / Mother / Guardian"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Guardian Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Phone *</label>
              <input
                required
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                pattern="[0-9]{10,15}"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>
            {/* Course Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Payment Amount *</label>
              <input
                required
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                name="courseAmount"
                placeholder="Enter course fee"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Discount Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
              <input
                type="number"
                name="discountAmount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Enter discount (if any)"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>
            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Type *</label>
              <select
                required
                value={formData.paymentType}
                onChange={handleChange}
                name="paymentType"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              >
                <option value="Cash">Select Type</option>
                <option value="Cash">Cash</option>
                <option value="Bkash">Bkash</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Due Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Amount</label>
              <input
                type="number"
                name="dueAmount"
                value={due}
                readOnly
                placeholder="Calculated due amount"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3 bg-gray-100"
              />
            </div>
          </section>

          <footer className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-gray-500">By submitting, you confirm the information provided is correct.</p>
            <div className="flex gap-3">
              <button type="reset" className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
                Reset
              </button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700">
                Submit Application
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default Admission;
