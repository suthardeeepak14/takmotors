import { useState } from "react";

export default function HeroBikeEMICalculator() {
  const bikes = [
    { name: "DESTINI 125 PRIME", price: 86000 },
    { name: "HF DLX SELF OBD2B", price: 75500 },
    { name: "HF DLX SELF BLA OBD2B", price: 76563 },
    { name: "HF DLX I3S OBD2B", price: 77062 },
    { name: "HF DLX PRO I3S", price: 80892 },
    { name: "Splendor + SELF OBD2B", price: 89500 },
    { name: "Splendor + I3S OBD2B", price: 91000 },
    { name: "Splendor + I3S BLACK OBD2B", price: 91000 },
    { name: "Splendor + XTEC OBD2B", price: 93600 },
    { name: "Splendor + XTEC 2.0 OBD2B", price: 96500 },
    { name: "Super XTEC DR OBD2B", price: 98000 },
    { name: "Super XTEC DISC OBD2B", price: 102500 },
    { name: "Xtreme 125R", price: 114600 },
  ];

  const financeCompanies = [
    "Amar Padama",
    "Bazaari Global Fincance",
    "Hero Fincorp",
    "Namdev Finvest Pvt Ltd.",
  ];

  // EMI factors for each finance company

  const [bike, setBike] = useState(bikes[0]);
  const [financeCompany, setFinanceCompany] = useState(financeCompanies[0]);
  const [downPayment, setDownPayment] = useState(10000);
  const [emiResults, setEmiResults] = useState(null);
  const [error, setError] = useState("");

  const calculateEMI = () => {
    if (downPayment < 0 || downPayment >= bike.price) {
      setError("⚠️ Down payment must be less than the bike price.");
      setEmiResults(null);
      return;
    }

    setError("");
    const loanAmount = bike.price - downPayment + 5000;
    const results = {};
    let tenures = [];
    let annualInterestRate = 0.13; // default
    let extraPerEMI = 0;

    switch (financeCompany) {
      case "Bazaari Global Fincance":
        annualInterestRate = 0.13;
        tenures = [12, 18, 24, 30, 36];
        break;
      case "Namdev Finvest Pvt Ltd.":
        annualInterestRate = 0.118;
        tenures = [12, 18, 24, 30, 36];
        break;
      case "Amar Padama":
        annualInterestRate = 0.13;
        extraPerEMI = 40;
        tenures = [12, 17, 23, 29, 35];
        break;
      case "Hero Fincorp":
      default:
        annualInterestRate = 0.13;
        tenures = [12, 18, 24, 30, 36];
    }

    tenures.forEach((months) => {
      let emi = 0;
      if (financeCompany === "Amar Padama") {
        const tenureYears = months / 12;
        const totalPayable =
          loanAmount + loanAmount * annualInterestRate * tenureYears;
        emi = totalPayable / months + extraPerEMI; // Add ₹40 per EMI
      } else {
        const tenureYears = months / 12;
        const totalPayable =
          loanAmount + loanAmount * annualInterestRate * tenureYears;
        emi = totalPayable / months;
      }
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

        {/* Error message */}
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

        {/* Result */}
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
                  <th className="p-2 border">Tenure</th>
                  <th className="p-2 border">EMI</th>
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
