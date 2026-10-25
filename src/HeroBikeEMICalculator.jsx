import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function HeroBikeEMICalculator() {
  const bikes = [
    { name: "DESTINI 110 FI VX OBD2B", price: 95141 },
    { name: "DESTINI 125  OBD2B", price: 102198 },
    { name: "DESTINI 125 XTEC ZX+ OBD2B", price: 113493},
    { name: "HF DLX SELF OBD2B", price: 79777 },
    { name: "HF DLX SELF OBD2B BLA", price: 74889 },
    { name: "HF DLX I3S OBD2B", price: 81946 },
    { name: "HF DLX PRO I3S", price: 85742 },
    { name: "Splendor + SELF OBD2B", price: 95212 },
    { name: "Splendor + I3S BLACK/MSG ", price: 96512 },
    { name: "Splendor + I3S FLEX BLK ", price: 100853 },
    { name: "Splendor + XTEC OBD2B", price: 99246 },
    { name: "Splendor + XTEC DISC OBD2B", price: 102627 },
    { name: "Splendor + XTEC 2.0 OBD2B", price: 101908 },
    { name: "Super XTEC 2.0 OBD2B DR", price: 103633 },
    { name: "Super XTEC 2.0 OBD2B DISC", price: 108005 },
    { name: "GLAMOUR X DISC", price: 115384 },
    { name: "Xtreme 125R DUAL ABS", price: 129545 },
  ];

  const financeCompanies = [
    "Amar Padma",
    "Namdev Finvest Pvt Ltd.",
  ];

  const [bike, setBike] = useState(bikes[5]);
  const [financeCompany, setFinanceCompany] = useState(financeCompanies[0]);
  const [downPayment, setDownPayment] = useState("15000");
  const [emiResults, setEmiResults] = useState(null);
  const [error, setError] = useState("");
  const [showLoanAmount, setShowLoanAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculatedDownPayment, setCalculatedDownPayment] = useState(null);
  const [calculatedLoanAmount, setCalculatedLoanAmount] = useState(null);

  // ---------- Handlers for clearing results on change ----------
  const handleFinanceChange = (value) => {
    setFinanceCompany(value);
    setEmiResults(null);
    setCalculatedDownPayment(null);
    setCalculatedLoanAmount(null);
  };

  const handleBikeChange = (value) => {
    setBike(bikes.find((b) => b.name === value));
    setEmiResults(null);
    setCalculatedDownPayment(null);
    setCalculatedLoanAmount(null);
  };

  const handleDownPaymentChange = (value) => {
    const sanitized = value.replace(/\D/g, "");
    setDownPayment(sanitized);
    setEmiResults(null);
    setCalculatedDownPayment(null);
    setCalculatedLoanAmount(null);
  };

  // ---------- EMI Calculation ----------
  const calculateEMI = () => {
    const dp = Number(downPayment);

    if (dp < 0 || dp >= bike.price) {
      setError("⚠️ Down payment must be less than the bike price.");
      setEmiResults(null);
      return;
    }

    setError("");
    setLoading(true);
    setEmiResults(null);

    setTimeout(() => {
      const baseLoan = bike.price - dp;
      const results = {};

      if (financeCompany === "Amar Padma") {
        const annualInterestRate = 0.13;
        const extraPerEMI = 40;
        const mapping = [
          { interest: 12, emi: 12 },
          { interest: 18, emi: 17 },
          { interest: 24, emi: 23 },
          { interest: 30, emi: 29 },
          { interest: 36, emi: 35 },
        ];
        const loan = baseLoan + 5000;

        mapping.forEach(({ interest, emi }) => {
          const monthlyInterest = (loan * annualInterestRate) / 12;
          const totalInterest = monthlyInterest * interest;
          const totalPayable = loan + totalInterest;
          results[emi] = (totalPayable / emi + extraPerEMI).toFixed(0);
        });

        setEmiResults(results);
        setCalculatedDownPayment(dp);
        setCalculatedLoanAmount(loan);
        setLoading(false);
        return;
      }

      // Other companies
      const tenures = [12, 18, 24, 30, 36];
      let annualInterestRate =
        financeCompany === "Namdev Finvest Pvt Ltd." ? 0.122 : 0.13;
      const loan = baseLoan + 5500;

      tenures.forEach((months) => {
        const totalInterest = (loan * annualInterestRate * months) / 12;
        const totalPayable = loan + totalInterest;
        results[months] = (totalPayable / months).toFixed(0);
      });

      setEmiResults(results);
      setCalculatedDownPayment(dp);
      setCalculatedLoanAmount(loan);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Hero Bike EMI Calculator
        </h1>

        {/* Finance Company */}
        <label className="block mb-2 font-medium">Select Finance Company</label>
        <select
          className="w-full border rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={financeCompany}
          onChange={(e) => handleFinanceChange(e.target.value)}
          disabled={loading}
        >
          {financeCompanies.map((company) => (
            <option key={company}>{company}</option>
          ))}
        </select>

        {/* Bike Model */}
        <label className="block mb-2 font-medium">Select Bike Model</label>
        <select
          className="w-full border rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={bike.name}
          onChange={(e) => handleBikeChange(e.target.value)}
          disabled={loading}
        >
          {bikes.map((b) => (
            <option key={b.name}>{b.name}</option>
          ))}
        </select>

        {/* Down Payment */}
        <label className="block mb-2 font-medium">Down Payment (₹)</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 mb-2 outline-none focus:ring-2 focus:ring-blue-500"
          value={downPayment}
          onChange={(e) => handleDownPaymentChange(e.target.value)}
          disabled={loading}
        />

        {emiResults === null && calculatedDownPayment !== null && (
          <p className="text-sm text-orange-600 mb-2">
            ⚠️ You changed some inputs. Click “Calculate EMI” to update results.
          </p>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-2 text-sm rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={calculateEMI}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Calculating...
            </>
          ) : (
            "Calculate EMI"
          )}
        </button>

        {/* EMI Results */}
        {emiResults && (
          <div className="mt-6 bg-blue-50 p-4 rounded-xl text-left">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 font-medium">Loan Amount:</p>
              <div className="flex items-center space-x-2">
                <span className="text-red-800 font-semibold">
                  {showLoanAmount
                    ? `₹${Number(calculatedLoanAmount).toLocaleString()}`
                    : "*****"}
                </span>
                <button
                  onClick={() => setShowLoanAmount(!showLoanAmount)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {showLoanAmount ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <p className="text-gray-700">
              <strong>Price:</strong> ₹{bike.price.toLocaleString()}
            </p>
            <p className="text-gray-700">
              <strong>Finance Company:</strong> {financeCompany}
            </p>
            <p className="text-gray-700">
              <strong>Bike:</strong> {bike.name}
            </p>
            <p className="text-gray-700">
              <strong>Down Payment:</strong> ₹
              {Number(calculatedDownPayment).toLocaleString()}
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-700">
              EMI Breakdown by Tenure
            </h3>

            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 border">Tenure (Months)</th>
                  <th className="p-2 border">EMI (₹)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(emiResults).map(([months, value]) => (
                  <tr key={months}>
                    <td className="border p-2">{months}</td>
                    <td className="border p-2 font-semibold text-green-600">
                      ₹{value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
