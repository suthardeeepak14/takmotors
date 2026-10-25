
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function HeroBikeEMICalculator() {
  const bikes = [
    { name: "DESTINI 110 FI VX OBD2B", price: 95141 },
    { name: "DESTINI 125 OBD2B", price: 102198 },
    { name: "DESTINI 125 XTEC ZX+ OBD2B", price: 113493 },
    { name: "HF DLX SELF OBD2B", price: 79777 },
    { name: "HF DLX SELF OBD2B BLA", price: 74889 },
    { name: "HF DLX I3S OBD2B", price: 81946 },
    { name: "HF DLX PRO I3S", price: 85742 },
    { name: "Splendor + SELF OBD2B", price: 95212 },
    { name: "Splendor + I3S BLACK/MSG", price: 96512 },
    { name: "Splendor + I3S FLEX BLK", price: 100853 },
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
  const [financeCompany, setFinanceCompany] = useState(
    financeCompanies[0]
  );
  const [downPayment, setDownPayment] = useState("15000");
  const [discount, setDiscount] = useState("0");
  const [showDiscount, setShowDiscount] = useState(false);

  const [emiResults, setEmiResults] = useState(null);
  const [error, setError] = useState("");
  const [showLoanAmount, setShowLoanAmount] = useState(false);
  const [loading, setLoading] = useState(false);

  const [calculatedDownPayment, setCalculatedDownPayment] =
    useState(null);
  const [calculatedLoanAmount, setCalculatedLoanAmount] =
    useState(null);
  const [calculatedDiscount, setCalculatedDiscount] = useState(null);
  const [calculatedBikePrice, setCalculatedBikePrice] = useState(null);
  const [calculatedFinanceCompany, setCalculatedFinanceCompany] =
    useState(null);
  const [calculatedBikeName, setCalculatedBikeName] = useState(null);

  const money = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  const clearResults = () => {
    setEmiResults(null);
    setCalculatedDownPayment(null);
    setCalculatedLoanAmount(null);
    setCalculatedDiscount(null);
    setCalculatedBikePrice(null);
    setCalculatedFinanceCompany(null);
    setCalculatedBikeName(null);
    setError("");
  };

  const handleFinanceChange = (value) => {
    setFinanceCompany(value);
    clearResults();
  };

  const handleBikeChange = (value) => {
    const selectedBike = bikes.find((item) => item.name === value);

    if (!selectedBike) return;

    setBike(selectedBike);
    clearResults();
  };

  const handleDownPaymentChange = (value) => {
    setDownPayment(value.replace(/\D/g, ""));
    clearResults();
  };

  const handleDiscountChange = (value) => {
    setDiscount(value.replace(/\D/g, ""));
    clearResults();
  };

  const handleDiscountToggle = (enabled) => {
    setShowDiscount(enabled);

    if (!enabled) {
      setDiscount("0");
    }

    clearResults();
  };

  const calculateEMI = () => {
    const dp = Number(downPayment || 0);
    const disc = showDiscount ? Number(discount || 0) : 0;
    const finalPrice = bike.price - disc;

    if (!Number.isFinite(dp) || !Number.isFinite(disc)) {
      setError("Please enter valid amounts.");
      setEmiResults(null);
      return;
    }

    if (disc < 0 || disc >= bike.price) {
      setError("Discount must be less than the bike price.");
      setEmiResults(null);
      return;
    }

    if (dp < 0 || dp >= finalPrice) {
      setError(
        "Down payment must be less than the discounted bike price."
      );
      setEmiResults(null);
      return;
    }

    setError("");
    setLoading(true);
    setEmiResults(null);

    // Discount is deducted before calculating the loan.
    // Original finance charges and interest formulas are preserved.
    window.setTimeout(() => {
      const baseLoan = finalPrice - dp;
      const results = {};
      let loan;

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

        loan = baseLoan + 5000;

        mapping.forEach(({ interest, emi }) => {
          const monthlyInterest =
            (loan * annualInterestRate) / 12;
          const totalInterest = monthlyInterest * interest;
          const totalPayable = loan + totalInterest;

          results[emi] = Math.round(
            totalPayable / emi + extraPerEMI
          );
        });
      } else {
        const tenures = [12, 18, 24, 30, 36];

        const annualInterestRate =
          financeCompany === "Namdev Finvest Pvt Ltd."
            ? 0.122
            : 0.13;

        loan = baseLoan + 5500;

        tenures.forEach((months) => {
          const totalInterest =
            (loan * annualInterestRate * months) / 12;
          const totalPayable = loan + totalInterest;

          results[months] = Math.round(
            totalPayable / months
          );
        });
      }

      setCalculatedDownPayment(dp);
      setCalculatedLoanAmount(loan);
      setCalculatedDiscount(disc);
      setCalculatedBikePrice(finalPrice);
      setCalculatedFinanceCompany(financeCompany);
      setCalculatedBikeName(bike.name);

      setEmiResults(results);
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
        <label
          htmlFor="finance-company"
          className="block mb-2 font-medium"
        >
          Select Finance Company
        </label>

        <select
          id="finance-company"
          className="w-full border rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={financeCompany}
          onChange={(e) => handleFinanceChange(e.target.value)}
          disabled={loading}
        >
          {financeCompanies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        {/* Bike Model */}
        <label
          htmlFor="bike-model"
          className="block mb-2 font-medium"
        >
          Select Bike Model
        </label>

        <select
          id="bike-model"
          className="w-full border rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={bike.name}
          onChange={(e) => handleBikeChange(e.target.value)}
          disabled={loading}
        >
          {bikes.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Original Bike Price */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 border rounded-lg">
          <span className="text-gray-700 font-medium">
            Bike Price
          </span>
          <strong>{money(bike.price)}</strong>
        </div>

        {/* Down Payment */}
        <label
          htmlFor="down-payment"
          className="block mb-2 font-medium"
        >
          Down Payment (₹)
        </label>

        <input
          id="down-payment"
          type="text"
          inputMode="numeric"
          className="w-full border rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={downPayment}
          onChange={(e) =>
            handleDownPaymentChange(e.target.value)
          }
          disabled={loading}
        />

        {/* Discount Toggle - Below Down Payment */}
        <div className="mb-4 p-3 border rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-gray-700">
              Apply Discount?
            </span>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="discount-toggle"
                  checked={!showDiscount}
                  onChange={() => handleDiscountToggle(false)}
                  disabled={loading}
                  className="accent-blue-600"
                />
                <span>No</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="discount-toggle"
                  checked={showDiscount}
                  onChange={() => handleDiscountToggle(true)}
                  disabled={loading}
                  className="accent-blue-600"
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          {/* Only show the textbox when Yes is selected */}
          {showDiscount && (
            <div className="mt-3">
              <label
                htmlFor="discount-amount"
                className="block mb-2 font-medium text-gray-700"
              >
                Discount Amount (₹)
              </label>

              <input
                id="discount-amount"
                type="text"
                inputMode="numeric"
                placeholder="Enter discount amount"
                className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                value={discount}
                onChange={(e) =>
                  handleDiscountChange(e.target.value)
                }
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* Validation Error */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 text-red-600 p-3 text-sm rounded-lg mb-4 text-center"
          >
            {error}
          </div>
        )}

        {/* Calculate Button */}
        <button
          type="button"
          onClick={calculateEMI}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold transition hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-gray-700 font-medium">
                Loan Amount:
              </p>

              <div className="flex items-center gap-2">
                <span className="text-red-800 font-semibold">
                  {showLoanAmount
                    ? money(calculatedLoanAmount)
                    : "*****"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setShowLoanAmount((previous) => !previous)
                  }
                  className="text-gray-600 hover:text-blue-600"
                  aria-label={
                    showLoanAmount
                      ? "Hide loan amount"
                      : "Show loan amount"
                  }
                >
                  {showLoanAmount ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-1">
              <strong>Original Price:</strong>{" "}
              {money(bike.price)}
            </p>

            {calculatedDiscount > 0 && (
              <p className="text-green-700 mb-1">
                <strong>Discount Applied:</strong>{" "}
                {money(calculatedDiscount)}
              </p>
            )}

            <p className="text-gray-700 mb-1">
              <strong>Final Bike Price:</strong>{" "}
              {money(calculatedBikePrice)}
            </p>

            <p className="text-gray-700 mb-1">
              <strong>Finance Company:</strong>{" "}
              {calculatedFinanceCompany}
            </p>

            <p className="text-gray-700 mb-1">
              <strong>Bike:</strong> {calculatedBikeName}
            </p>

            <p className="text-gray-700 mb-1">
              <strong>Down Payment:</strong>{" "}
              {money(calculatedDownPayment)}
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-700">
              EMI Breakdown by Tenure
            </h3>

            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 border">
                    Tenure (Months)
                  </th>
                  <th className="p-2 border">EMI (₹)</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(emiResults).map(
                  ([months, value]) => (
                    <tr key={months}>
                      <td className="border p-2 text-center">
                        {months}
                      </td>
                      <td className="border p-2 text-center font-semibold text-green-600">
                        {money(value)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <p className="text-xs text-gray-500 mt-3">
              EMI is an estimate based on the configured interest
              rate and finance charges. Confirm the final amount
              with the finance company.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
