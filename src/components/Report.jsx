/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { jsPDF } from "jspdf";        // <--- named import is important for many bundlers (Vite/ESM)
import "jspdf-autotable";            // patches jsPDF with autoTable
import * as XLSX from "xlsx";

const Report = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState([]);
  const [overall, setOverall] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }
    try {
      const res = await fetch(
        `${baseUrl}/admissions-report?from=${startDate}&to=${endDate}`
      );
      const data = await res.json();
      setReport(data.data || []);
      setOverall(data.overall || null);
    } catch (err) {
      console.error("fetchReport error:", err);
      alert("Failed to fetch report — check console.");
    }
  };

  // Export PDF (fixed)
  const exportPDF = () => {
    if (!report || report.length === 0) {
      alert("No data to export");
      return;
    }
    if (!overall) {
      alert("Please generate the report first");
      return;
    }

    try {
      // Create doc
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // Title
      doc.setFontSize(16);
      doc.text("Admission & Fees Report", 40, 40);

      // Table header + rows
      const head = [
        [
          "Student ID",
          "Course",
          "Batch",
          "Admissio Amount (BDT)",
          "Fees Amount (BDT)",
        ],
      ];
      const body = report.map((it) => [
        it.std_id,
        it.course,
        it.batch_no,
        Number(it.course_amount).toFixed(2),
        Number(it.fees_amount).toFixed(2),
      ]);

      // Draw table
      doc.autoTable({
        head,
        body,
        startY: 60,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [230, 230, 230] },
      });

      // get final Y after table
      const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 60;
      let y = finalY + 20;

      // Overall summary
      doc.setFontSize(11);
      doc.text(`Summary (${startDate} → ${endDate}):`, 40, y);
      y += 16;
      doc.text(`Total Students: ${overall.total_students}`, 40, y);
      y += 14;
      doc.text(`Total Admission (course_amount sum): ${Number(overall.total_course).toFixed(2)} BDT`, 40, y);
      y += 14;
      doc.text(`Total Fees (fees sum): ${Number(overall.total_fees).toFixed(2)} BDT`, 40, y);
      y += 14;
      doc.setTextColor(12, 74, 160);
      doc.text(`Grand Total: ${Number(overall.grand_total).toFixed(2)} BDT`, 40, y);

      // Save file
      const fileName = `admission-fees-${startDate}-to-${endDate}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("exportPDF error:", err);
      alert("PDF export failed — check console for details.");
    }
  };

  // Export Excel (unchanged)
  const exportExcel = () => {
    if (!report || report.length === 0) {
      alert("No data to export");
      return;
    }
    const wsData = [
      ["Student ID", "Course", "Batch", "Admission Amount (BDT)", "Fees Amount (BDT)"],
      ...report.map((item) => [
        item.std_id,
        item.course,
        item.batch_no,
        Number(item.course_amount).toFixed(2),
        Number(item.fees_amount).toFixed(2),
      ]),
    ];

    if (overall) {
      wsData.push([]);
      wsData.push(["Overall Summary"]);
      wsData.push(["Total Students", overall.total_students]);
      wsData.push(["Total Admission", Number(overall.total_course).toFixed(2)]);
      wsData.push(["Total Fees", Number(overall.total_fees).toFixed(2)]);
      wsData.push(["Grand Total", Number(overall.grand_total).toFixed(2)]);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `admission-fees-${startDate}-to-${endDate}.xlsx`);
  };

  return (
    <section className="bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full bg-white shadow-lg rounded-xl p-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-600">Admission & Fees Report</h1>
        </header>

        <section className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          <button onClick={fetchReport} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Filter</button>

          {report.length > 0 && (
            <>
              {/* <button onClick={exportPDF} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Export PDF</button> */}
              <button onClick={exportExcel} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Export Excel</button>
            </>
          )}
        </section>

        <section className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Student ID</th>
                <th className="py-2 px-4 border">Course</th>
                <th className="py-2 px-4 border">Batch</th>
                <th className="py-2 px-4 border">Admission</th>
                <th className="py-2 px-4 border">Fees Amount</th>
              </tr>
            </thead>
            <tbody>
              {report.length > 0 ? (
                report.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{item.std_id}</td>
                    <td className="border px-4 py-2">{item.course}</td>
                    <td className="border px-4 py-2">{item.batch_no}</td>
                    <td className="border px-4 py-2 text-right">{Number(item.course_amount).toFixed(2)} BDT</td>
                    <td className="border px-4 py-2 text-right">{Number(item.fees_amount).toFixed(2)} BDT</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 border">No data found for selected range</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {overall && (
          <section className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">Overall Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-white shadow rounded">
                <p className="text-gray-500">Total Students</p>
                <p className="font-bold">{overall.total_students}</p>
              </div>
              <div className="p-3 bg-white shadow rounded">
                <p className="text-gray-500">Total Admission</p>
                <p className="font-bold">{Number(overall.total_course).toFixed(2)} BDT</p>
              </div>
              <div className="p-3 bg-white shadow rounded">
                <p className="text-gray-500">Total Fees</p>
                <p className="font-bold">{Number(overall.total_fees).toFixed(2)} BDT</p>
              </div>
              <div className="p-3 bg-white shadow rounded">
                <p className="text-gray-500">Grand Total</p>
                <p className="font-bold text-blue-600">{Number(overall.grand_total).toFixed(2)} BDT</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default Report;
