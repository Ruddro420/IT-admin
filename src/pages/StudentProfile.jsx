/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL; // change this to your API URL

const StudentProfile = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [courseFee, setCourseFee] = useState(null);

    // Fetch student details
    useEffect(() => {
        const fetchStudentDetails = (stdId) => {
            setIsLoading(true);
            fetch(`${baseUrl}/students/${stdId}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Student not found");
                    return res.json();
                })
                .then((studentData) => {
                    const totalPaid = Array.isArray(studentData.fees)
                        ? studentData.fees.reduce(
                            (sum, fee) => sum + parseFloat(fee.amount || 0),
                            0
                        )
                        : 0;

                    const initialDue = parseFloat(studentData.due_amount) || 0;
                    const currentDue = initialDue - totalPaid;

                    setStudent({
                        ...studentData,
                        paid: totalPaid,
                        dueAmount: currentDue > 0 ? currentDue : 0,
                        fees: Array.isArray(studentData.fees) ? studentData.fees : [],
                    });
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching student details:", error);
                    toast.error("Student not found");
                    setStudent(null);
                    setIsLoading(false);
                });
        };

        if (id) {
            fetchStudentDetails(id);
        }
    }, [id]);

    // Fetch all courses to get course fee
    useEffect(() => {
        if (student?.course) {
            fetch(`${baseUrl}/courses`)
                .then((res) => res.json())
                .then((data) => {
                    const matchedCourse = data.find(
                        (c) => c.name.toLowerCase() === student.course.toLowerCase()
                    );
                    if (matchedCourse) {
                        setCourseFee(matchedCourse.fee);
                    }
                })
                .catch((err) => console.error("Error fetching courses:", err));
        }
    }, [student?.course]);

    if (isLoading) {
        return <p className="text-center mt-10">Loading student details...</p>;
    }

    if (!student) {
        return <p className="text-center mt-10 text-red-500">Student not found.</p>;
    }

    return (
        <div className="w-full mx-auto mt-10">
            <div className="bg-white shadow-lg rounded-lg p-6">
                {/* Header */}
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Student Profile
                </h2>

                {/* Personal & Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-medium mb-3">Personal Details</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">ID</td>
                                        <td className="px-4 py-2 border">{student.std_id}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Name</td>
                                        <td className="px-4 py-2 border">{student.full_name}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Email</td>
                                        <td className="px-4 py-2 border">{student.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Mobile</td>
                                        <td className="px-4 py-2 border">{student.mobile}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">DOB</td>
                                        <td className="px-4 py-2 border">{student.dob}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">
                                            Present Address
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {student.present_address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">
                                            Permanent Address
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {student.permanent_address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Guardian</td>
                                        <td className="px-4 py-2 border">{student.guardian_name}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">
                                            Guardian Phone
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {student.guardian_phone}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Course Details */}
                    <div>
                        <h3 className="text-lg font-medium mb-3">Course Details</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Course</td>
                                        <td className="px-4 py-2 border">{student.course}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Batch</td>
                                        <td className="px-4 py-2 border">{student.batch_no}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">
                                            Admission Date
                                        </td>
                                        <td className="px-4 py-2 border">{student.admission_date}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Course Fee</td>
                                        <td className="px-4 py-2 border">
                                            {courseFee ? `${courseFee} BDT` : "Loading..."}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Discount</td>
                                        <td className="px-4 py-2 border">
                                            {student.discount_amount} BDT
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">
                                            Admission Payment Type
                                        </td>
                                        <td className="px-4 py-2 border">{student.payment_type}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">
                                            Total Paid
                                        </td>
                                        <td className="px-4 py-2 border">{student.course_amount} BDT</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border font-semibold">Due Amount</td>
                                        <td className="px-4 py-2 border text-red-600 font-semibold">
                                            {student.dueAmount} BDT
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Admission Payment */}
                <div className="mb-10">
                    <h3 className="text-lg font-medium mb-3">Admission Payment</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 border text-left">Course Amount</th>
                                    <th className="px-4 py-3 border text-left">Discount</th>
                                    <th className="px-4 py-3 border text-left">Paid</th>
                                    <th className="px-4 py-3 border text-left">Payment Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-4 py-3 border">
                                        {courseFee ? `${courseFee} BDT` : "Loading..."}

                                    </td>
                                    <td className="px-4 py-3 border">
                                        {student.discount_amount} BDT
                                    </td>
                                    <td className="px-4 py-3 border">
                                        {student.course_amount} BDT
                                    </td>
                                    <td className="px-4 py-3 border">{student.payment_type}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Fees Details */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Fees Details</h3>
                    {student.fees.length === 0 ? (
                        <p className="text-gray-500">No fee records found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 border text-left">Date</th>
                                        <th className="px-4 py-3 border text-left">Amount</th>
                                        <th className="px-4 py-3 border text-left">Purpose</th>
                                        <th className="px-4 py-3 border text-left">Payment Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.fees.map((fee, idx) => (
                                        <tr
                                            key={fee.id}
                                            className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                        >
                                            <td className="px-4 py-3 border">{fee.date}</td>
                                            <td className="px-4 py-3 border">{fee.amount} BDT</td>
                                            <td className="px-4 py-3 border">{fee.purpose}</td>
                                            <td className="px-4 py-3 border">{fee.payment_type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
