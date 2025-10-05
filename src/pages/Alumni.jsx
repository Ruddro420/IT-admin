/* eslint-disable prettier/prettier */
import  { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const Alumni = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    altNumber: '',
    email: '',
    address: '',
    dob: '',
    gender: '',
    course: '',
    batchNo: '',
    admissionDate: '',
    earning: '',
    finishedCourse: '',
    earningAmount: '',
    job: ''
  });


  const fetchCourses = useCallback(() => {
    fetch(`${baseUrl}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, [baseUrl]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);





  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);




    e.preventDefault();


      const newAlumni = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        altNumber: formData.altNumber,
        email: formData.email,
        address: formData.address,
        dob: formData.dob,
        gender: formData.gender,
        course: formData.course,
        batchNo: formData.batchNo,
        admissionDate: new Date().toISOString().split('T')[0],
        earning: formData.earning,
        finishedCourse: formData.finishedCourse,
        earningAmount: formData.earningAmount,
        job: formData.job,
      };

      console.log(newAlumni);

      //add visitor to database (mocked here)
      // setVisitors([...visitors, newVisitor]);
      fetch(`${baseUrl}/alumni`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAlumni)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Alumni added:', data);
          toast.success('Added successfully');
        })
        .catch((error) => {
          toast.error('Error Adding Alumni');
          console.error('Error adding Alumni:', error);
        });








    // Example of submission (mock)
    // toast.success('Alumni data submitted successfully');
  };

  return (
    <div>
        <Link className='px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700' to='../../dashboard/alumniDetails' >Details</Link>
      <main className="w-full mt-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm border border-[#e6ebf1] rounded p-6 md:p-10"
        >
          <header className="mb-6">
            <h5 className="text-xl md:text-xl font-semibold">Alumni Information Form</h5>
            <p className="text-gray-500 mt-1">
              Please fill in the alumni details below. Fields marked with * are required.
            </p>
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
                placeholder="01XXXXXXXXX"
                pattern="[0-9]{10,15}"
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

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                // required
                name="address"
                rows="2"
                value={formData.address}
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
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender *</label>
              <select
                required
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Course *</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
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
              <label className="block text-sm font-medium text-gray-700">Batch No *</label>
              <input
                required
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                placeholder="e.g. Batch 15"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Finished Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Finished Course *</label>
              <select
                required
                name="finishedCourse"
                value={formData.finishedCourse}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Earning */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Earning *</label>
              <select
                required
                name="earning"
                value={formData.earning}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Earning Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Earning Amount</label>
              <input
                type="number"
                name="earningAmount"
                value={formData.earningAmount}
                onChange={handleChange}
                placeholder="Enter amount (if earning)"
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              />
            </div>

            {/* Job */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job</label>
              <select
                // required
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </section>

          <footer className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-gray-500">
              By submitting, you confirm the information provided is correct.
            </p>
            <div className="flex gap-3">
              <button
                type="reset"
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 cursor-pointer"
              >
                Submit Information
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default Alumni;
