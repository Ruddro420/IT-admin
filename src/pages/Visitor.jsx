/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const Visitor = () => {
    const [courses, setCourses] = useState([]);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [visitors, setVisitors] = useState([]);
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    
    // Filter states
    const [filterCourse, setFilterCourse] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterDate, setFilterDate] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch courses from server
    const fetchCourses = () => {
        fetch(`${baseUrl}/courses`)
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
                // toast.success('Courses loaded successfully');
            })
            .catch((error) => {
                toast.error('Error loading courses');
                console.error('Error fetching courses:', error);
            });
    }

    // Fetch visitors from server
    const fetchVisitors = () => {
        fetch(`${baseUrl}/visitors`)
            .then((res) => res.json())
            .then((data) => {
                setVisitors(data);
                setFilteredVisitors(data);
                // toast.success('Visitors loaded successfully');
            })
            .catch((error) => {
                toast.error('Error loading visitors');
                console.error('Error fetching visitors:', error);
            });
    }

    // Fetch courses and visitors on component mount
    useEffect(() => {
        fetchCourses();
        fetchVisitors();
    }, []);

    // Apply filters whenever filter states change
    useEffect(() => {
        applyFilters();
    }, [filterCourse, filterName, filterDate, visitors]);

    // State for form inputs
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        course: ''
    });

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.mobile || !formData.course) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const newVisitor = {
            name: formData.fullName,
            mobile: formData.mobile,
            course: formData.course,
            date: new Date().toISOString().split('T')[0] // today's date
        };

        fetch(`${baseUrl}/visitors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVisitor)
        })
            .then((res) => res.json())
            .then((data) => {
                toast.success('Visitor added successfully');
                fetchVisitors();
                // Clear form
                setFormData({ fullName: '', mobile: '', course: '' });
            })
            .catch((error) => {
                toast.error('Error adding visitor');
                console.error('Error adding visitor:', error);
            });
    };

    // Apply filters
    const applyFilters = () => {
        let filtered = visitors;

        if (filterCourse) {
            filtered = filtered.filter(v => 
                v.course?.toLowerCase().includes(filterCourse.toLowerCase())
            );
        }

        if (filterName) {
            filtered = filtered.filter(v => 
                v.name?.toLowerCase().includes(filterName.toLowerCase())
            );
        }

        if (filterDate) {
            filtered = filtered.filter(v => v.date === filterDate);
        }

        setFilteredVisitors(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Reset all filters
    const resetFilters = () => {
        setFilterCourse('');
        setFilterName('');
        setFilterDate('');
        setFilteredVisitors(visitors);
        setCurrentPage(1);
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVisitors = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Go to previous page
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Go to next page
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Export to PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text('Visitor Records', 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [['#', 'Full Name', 'Mobile', 'Course', 'Date']],
            body: filteredVisitors.map((v) => [v.id, v.name, v.mobile, v.course, v.date])
        });
        doc.save('visitor-records.pdf');
    };

    // Export to Excel
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredVisitors.map(v => ({
            ID: v.id,
            'Full Name': v.name,
            Mobile: v.mobile,
            Course: v.course,
            Date: v.date
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'visitor-records.xlsx');
    };

    return (
        <div className="w-full mt-5">
            {/* Visitor Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-[#e6ebf1] rounded p-6 md:p-10 mb-6" noValidate>
                <header className="mb-6">
                    <h5 className="text-xl font-semibold">Visitor Form</h5>
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
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
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
                            placeholder="01XXXXXXXXX"
                            value={formData.mobile}
                            onChange={handleChange}
                            pattern="[0-9]{10,15}"
                            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                        />
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
                </section>

                <footer className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-sm text-gray-500">By submitting, you confirm the information provided is correct.</p>
                    <div className="flex gap-3">
                        <button
                            type="reset"
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                            onClick={() => setFormData({ fullName: '', mobile: '', course: '' })}
                        >
                            Reset
                        </button>
                        <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700">
                            Submit Application
                        </button>
                    </div>
                </footer>
            </form>

            {/* Visitor Table */}
            <div className="bg-white shadow-sm border border-[#e6ebf1] rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                    <h5 className="text-lg font-semibold">Visitor Records</h5>
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Filter by name..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                        />
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                        >
                            <option value="">All Courses</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.name}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                        />
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-3">
                        <button onClick={exportPDF} className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow hover:bg-red-700">
                            Export PDF
                        </button>
                        <button onClick={exportExcel} className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700">
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* Items per page selector */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-sm text-gray-600">entries</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVisitors.length)} of {filteredVisitors.length} entries
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">#</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Full Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Mobile</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Course</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentVisitors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                currentVisitors.map((v,i) => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-600">{i+1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{v.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{v.mobile}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{v.course}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{v.date}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg border ${
                                currentPage === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === number
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg border ${
                                currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Visitor;