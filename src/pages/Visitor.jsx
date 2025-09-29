import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Visitor = () => {
    // State for storing visitors
    const [visitors, setVisitors] = useState([]);

    // State for form inputs
    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        course: "",
    });

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.mobile || !formData.course) {
            alert("Please fill in all required fields.");
            return;
        }

        const newVisitor = {
            id: visitors.length + 1,
            name: formData.fullName,
            mobile: formData.mobile,
            course: formData.course,
            date: new Date().toISOString().split("T")[0], // today’s date
        };

        setVisitors([...visitors, newVisitor]);

        // Clear form
        setFormData({ fullName: "", mobile: "", course: "" });
    };

    // Export to PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Visitor Records", 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [["#", "Full Name", "Mobile", "Course", "Date"]],
            body: visitors.map((v) => [v.id, v.name, v.mobile, v.course, v.date]),
        });
        doc.save("visitor-records.pdf");
    };

    // Export to Excel
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(visitors);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "visitor-records.xlsx");
    };

    return (
        <div className="w-full mt-5">
            {/* Visitor Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-sm border border-[#e6ebf1] rounded p-6 md:p-10"
                noValidate
            >
                <header className="mb-6">
                    <h5 className="text-xl font-semibold">Visitor Form</h5>
                    <p className="text-gray-500 mt-1">
                        Please fill in the details below. All fields marked with * are required.
                    </p>
                    <br />
                    <hr />
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name *
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700">
                            Mobile Number *
                        </label>
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
                        <input
                            required
                            type="text"
                            name="course"
                            placeholder="Course name"
                            value={formData.course}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                        />
                    </div>
                </section>

                <footer className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        By submitting, you confirm the information provided is correct.
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="reset"
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                            onClick={() => setFormData({ fullName: "", mobile: "", course: "" })}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700"
                        >
                            Submit Application
                        </button>
                    </div>
                </footer>
            </form>

            {/* Visitor Table */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold">Visitor Records</h5>
                    <div className="flex gap-3">
                        <button
                            onClick={exportPDF}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow hover:bg-red-700"
                        >
                            Export PDF
                        </button>
                        <button
                            onClick={exportExcel}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700"
                        >
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white shadow-sm border border-[#e6ebf1] rounded-lg">
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
                            {visitors.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                visitors.map((v) => (
                                    <tr key={v.id}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{v.id}</td>
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
            </div>
        </div>
    );
};

export default Visitor;
