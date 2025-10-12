import { useState } from "react";

export default function HeroBikeEMICalculator() {
  const bikes = [
    { name: "DESTINI 110", price: 87700 },
    { name: "HF DLX SELF", price: 75500 },
    { name: "HF DLX SELF BLACK", price: 76700 },
    { name: "HF DLX I3S ", price: 77100 },
    { name: "HF DLX PRO I3S", price: 80900 },
    { name: "Splendor + SELF", price: 89500 },
    { name: "Splendor + I3S", price: 91000 },
    { name: "Splendor + XTEC", price: 93700 },
    { name: "Splendor + XTEC DISC", price: 97000 },
    { name: "Splendor + XTEC 2.0", price: 96500 },
    { name: "Super XTEC DR", price: 98000 },
    { name: "Super XTEC DISC", price: 102500 },
    { name: "Xtreme 125R", price: 114600 },
  ];

  const financeCompanies = [
    "Amar Padma",
    "Bazaari Global Fincance",
    "Hero Fincorp",
    "Namdev Finvest Pvt Ltd.",
  ];

  const [bike, setBike] = useState(bikes[0]);
  const [financeCompany, setFinanceCompany] = useState(financeCompanies[0]);
  const [downPayment, setDownPayment] = useState(15000);
  const [emiResults, setEmiResults] = useState(null);
  const [error, setError] = useState("");

  const calculateEMI = () => {
    if (downPayment < 0 || downPayment >= bike.price) {
      setError("⚠️ Down payment must be less than the bike price.");
      setEmiResults(null);
      return;
    }

    setError("");
    const baseLoan = bike.price - downPayment;
    const results = {};

    // ---- Amar Padma Special Logic (Unchanged) ----
    if (financeCompany === "Amar Padma") {
      const annualInterestRate = 0.13;
      const extraPerEMI = 40;
      const amarPadmaMapping = [
        { interest: 12, emi: 12 },
        { interest: 18, emi: 17 },
        { interest: 24, emi: 23 },
        { interest: 30, emi: 29 },
        { interest: 36, emi: 35 },
      ];

      const loan = baseLoan + 5000; // Processing Fee

      amarPadmaMapping.forEach(({ interest, emi }) => {
        const monthlyInterest = (loan * annualInterestRate) / 12;
        const totalInterest = monthlyInterest * interest;
        const totalPayable = loan + totalInterest;
        const emiValue = totalPayable / emi + extraPerEMI;
        results[`${emi} (Interest ${interest})`] = emiValue.toFixed(0);
      });

      setEmiResults(results);
      return;
    }

    // ---- Other Companies (Flat Interest + ₹5000 Processing) ----
    const tenures = [12, 18, 24, 30, 36];
    let annualInterestRate = 0.13;

    if (financeCompany === "Namdev Finvest Pvt Ltd.") {
      annualInterestRate = 0.118;
    }

    const loanWithProcessing = baseLoan + 5000;

    tenures.forEach((months) => {
      const totalInterest =
        (loanWithProcessing * annualInterestRate * months) / 12;
      const totalPayable = loanWithProcessing + totalInterest;
      const emi = totalPayable / months;
      results[months] = emi.toFixed(0);
    });

    setEmiResults(results);
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
          onChange={(e) => setFinanceCompany(e.target.value)}
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
          onChange={(e) =>
            setBike(bikes.find((b) => b.name === e.target.value))
          }
        >
          {bikes.map((b) => (
            <option key={b.name}>{b.name}</option>
          ))}
        </select>

        {/* Down Payment */}
        <label className="block mb-2 font-medium">Down Payment (₹)</label>
        <input
          type="number"
          className="w-full border rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-2 text-sm rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={calculateEMI}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Calculate EMI
        </button>

        {/* EMI Results */}
        {emiResults && (
          <div className="mt-6 bg-blue-50 p-4 rounded-xl text-left">
            <p className="text-gray-700">
              <strong>Finance Company:</strong> {financeCompany}
            </p>
            <p className="text-gray-700">
              <strong>Bike:</strong> {bike.name}
            </p>
            <p className="text-gray-700">
              <strong>Price:</strong> ₹{bike.price.toLocaleString()}
            </p>
            <p className="text-gray-700">
              <strong>Down Payment:</strong> ₹{downPayment.toLocaleString()}
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
