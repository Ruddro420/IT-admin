/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import toast from "react-hot-toast"; // ✅ use toast instead of alert

const AccountsReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filterType, setFilterType] = useState("All");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      toast.error("⚠️ Please select both dates");
      return;
    }
    try {
      toast.loading("Fetching report...");
      const res = await axios.post(`${baseUrl}/accounts/report`, {
        start_date: startDate,
        end_date: endDate,
      });
      const data = res.data;
      setRecords(data.records || []);
      setSummary({
        total_income: data.total_income || 0,
        total_expense: data.total_expense || 0,
        balance: data.balance || 0,
      });
      toast.dismiss(); // remove loading
      toast.success("✅ Report generated");
    } catch (err) {
      console.error("fetchReport error:", err);
      toast.dismiss();
      toast.error("❌ Failed to fetch report");
    }
  };

  const filteredRecords =
    filterType === "All"
      ? records
      : records.filter((r) => r.type === filterType);

  const exportPDF = () => {
    if (!filteredRecords || filteredRecords.length === 0) {
      toast.error("⚠️ No data to export");
      return;
    }
    if (!summary) {
      toast.error("⚠️ Please generate the report first");
      return;
    }

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      doc.setFontSize(16);
      doc.text("Accounts Report", 40, 40);

      const head = [["Type", "Purpose", "Date", "Amount (BDT)"]];
      const body = filteredRecords.map((it) => [
        it.type,
        it.purpose,
        it.date,
        Number(it.amount).toFixed(2),
      ]);

      doc.autoTable({
        head,
        body,
        startY: 60,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [230, 230, 230] },
      });

      const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 60;
      let y = finalY + 20;

      doc.setFontSize(11);
      doc.text(`Summary (${startDate} → ${endDate}):`, 40, y);
      y += 16;
      doc.text(
        `Total Income: ${Number(summary.total_income).toFixed(2)} BDT`,
        40,
        y
      );
      y += 14;
      doc.text(
        `Total Expense: ${Number(summary.total_expense).toFixed(2)} BDT`,
        40,
        y
      );
      y += 14;
      doc.setTextColor(12, 74, 160);
      doc.text(`Balance: ${Number(summary.balance).toFixed(2)} BDT`, 40, y);

      doc.save(`accounts-report-${startDate}-to-${endDate}.pdf`);
      toast.success("📄 PDF exported successfully");
    } catch (err) {
      console.error("exportPDF error:", err);
      toast.error("❌ PDF export failed");
    }
  };

  const exportExcel = () => {
    if (!filteredRecords || filteredRecords.length === 0) {
      toast.error("⚠️ No data to export");
      return;
    }

    const wsData = [
      ["Type", "Purpose", "Date", "Amount (BDT)"],
      ...filteredRecords.map((item) => [
        item.type,
        item.purpose,
        item.date,
        Number(item.amount).toFixed(2),
      ]),
    ];

    if (summary) {
      wsData.push([]);
      wsData.push(["Summary"]);
      wsData.push(["Total Income", Number(summary.total_income).toFixed(2)]);
      wsData.push(["Total Expense", Number(summary.total_expense).toFixed(2)]);
      wsData.push(["Balance", Number(summary.balance).toFixed(2)]);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `accounts-report-${startDate}-to-${endDate}.xlsx`);
    toast.success("📊 Excel exported successfully");
  };

  return (
    <section className="bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full bg-white shadow-lg rounded-xl p-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-600">Accounts Report</h1>
        </header>

        <section className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="All">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <button
            onClick={fetchReport}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Filter
          </button>

          {records.length > 0 && (
            <>
              {/* Uncomment if PDF needed */}
              {/* <button
                onClick={exportPDF}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Export PDF
              </button> */}
              <button
                onClick={exportExcel}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Export Excel
              </button>
            </>
          )}
        </section>

        {/* Table */}
        <section className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">Purpose</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="border px-4 py-2 font-semibold">
                      <span
                        className={`p-1 rounded-md text-white ${
                          item.type === "Income"
                            ? "bg-green-600"
                            : "bg-red-500"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="border px-4 py-2">{item.purpose}</td>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2 text-right font-bold">
                      {Number(item.amount).toFixed(2)} BDT
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500 border"
                  >
                    No data found for selected range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Summary */}
        {summary && (
          <section className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white shadow rounded">
                <p className="text-gray-500">Total Income</p>
                <p className="font-bold text-green-600">
                  {Number(summary.total_income).toFixed(2)} BDT
                </p>
              </div>
              <div className="p-3 bg-white shadow rounded">
                <p className="text-gray-500">Total Expense</p>
                <p className="font-bold text-red-600">
                  {Number(summary.total_expense).toFixed(2)} BDT
                </p>
              </div>
              <div className="p-3 bg-white shadow rounded">
                <p className="text-gray-500">Balance</p>
                <p className="font-bold text-blue-600">
                  {Number(summary.balance).toFixed(2)} BDT
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default AccountsReport;
