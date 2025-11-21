
export default function ComparisonSection() {
  const comparisonData = [
    {
      expense: "Device Cost",
      paper: "₹50,000",
      billzzy: "Your Mobile",
      colorBillzzy: false
    },
    {
      expense: "Paper Roll",
      paper: "₹0.12 - ₹0.15",
      billzzy: "-",
      colorBillzzy: true
    },
    {
      expense: "Maintenance",
      paper: "₹0.02 - ₹0.05",
      billzzy: "-",
      colorBillzzy: true
    },
    {
      expense: "Electric Bill",
      paper: "₹0.01 - ₹0.02",
      billzzy: "-",
      colorBillzzy: true
    },
    {
      expense: "WhatsApp API",
      paper: "-",
      billzzy: "₹0.15",
      colorBillzzy: false
    },
    {
      expense: "Total Per Bill",
      paper: "₹0.20 - ₹0.35+",
      billzzy: "₹0.15 Flat",
      isTotal: true,
      colorBillzzy: true
    },
  ];

  return (
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Title - Fixed at top with border */}
        <div className="text-center py-6 px-4 border-b-4" style={{ borderColor: '#5a4fcf', fontFamily: 'Poppins, sans-serif' }}>
          <h3 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-black">Cost </span>
            <span style={{ color: '#5a4fcf' }}>Comparison</span>
          </h3>
          <p className="text-slate-600 text-base md:text-lg">Paper Bills vs Billzzy Digital Bills</p>
        </div>

        {/* Table Container - Mobile Optimized */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
            {/* Header */}
            <thead>
              <tr style={{ backgroundColor: '#5a4fcf' }}>
                <th className="py-3 md:py-4 px-3 md:px-6 text-left text-white font-semibold text-sm md:text-lg whitespace-nowrap border-r border-white border-opacity-20">
                  Expense
                </th>
                <th className="py-3 md:py-4 px-3 md:px-6 text-center text-white font-semibold text-sm md:text-lg whitespace-nowrap border-r border-white border-opacity-20">
                  Paper Bill
                </th>
                <th className="py-3 md:py-4 px-3 md:px-6 text-center text-white font-semibold text-sm md:text-lg whitespace-nowrap">
                  Billzzy Bill
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {comparisonData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    item.isTotal
                      ? "bg-slate-200 font-bold"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50"
                  } hover:bg-slate-100 transition-colors duration-200 border-b border-slate-200`}
                >
                  {/* Expense - Single Line */}
                  <td className="py-3 md:py-4 px-3 md:px-6 text-slate-800 border-r border-slate-200 text-sm md:text-base whitespace-nowrap">
                    {item.expense}
                  </td>

                  {/* Paper Bill - Red highlight - Single Line */}
                  <td className="py-3 md:py-4 px-3 md:px-6 text-center bg-red-50 border-r border-red-100 text-red-800 font-semibold text-sm md:text-base whitespace-nowrap">
                    {item.paper}
                  </td>

                  {/* Billzzy Bill - Green highlight - Single Line */}
                  <td className="py-3 md:py-4 px-3 md:px-6 text-center bg-green-50 text-green-800 font-semibold text-sm md:text-base whitespace-nowrap">
                    {item.billzzy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="py-6 px-4 text-center border-t border-slate-200 bg-gradient-to-r from-green-50 to-blue-50">
          <p className="text-slate-700 text-sm md:text-base font-medium">
            Save money and go green with Billzzy! 🌱
          </p>
        </div>
      </div>
  );
}