import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const Admission = () => {
    return (
        <div>
            {/* Input Field */}
            <main className="w-full mt-5">
                <form
                    className="bg-white shadow-sm border border-[#e6ebf1] rounded p-6 md:p-10"
                    noValidate
                >
                    <header className="mb-6">
                        <h5 className="text-xl md:text-xl font-semibold">Admission Form</h5>
                        <p className="text-gray-500 mt-1">
                            Please fill in the details below. All fields marked with * are required.
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
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender *</label>
                            <select
                                required
                                name="gender"
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                            >
                                <option value="">Select gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* NID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">NID</label>
                            <input
                                type="text"
                                name="nid"
                                placeholder="National ID number"
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
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                            />
                        </div>

                        {/* Batch No */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Batch No *</label>
                            <input
                                required
                                type="text"
                                name="batchNo"
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
                                placeholder="01XXXXXXXXX"
                                pattern="[0-9]{10,15}"
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                            />
                        </div>
                        {/* Course Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Amount *</label>
                            <input
                                required
                                type="number"
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
                                placeholder="Enter discount (if any)"
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                            />
                        </div>
                        {/* Payment Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Type *</label>
                            <select
                                required
                                name="gender"
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 p-3"
                            >
                                <option value="">Select Type</option>
                                <option>Cash</option>
                                <option>Bkash</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* Due Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Due Amount</label>
                            <input
                                type="number"
                                name="dueAmount"
                                placeholder="Enter due amount"
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
            </main>
        </div>
    );
};

export default Admission;
