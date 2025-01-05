import React, { useState } from "react";

const AVAILABLE_DENOMINATIONS = [
  0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 50.0, 100.0, 1000.0,
];

function App() {
  const [targetAmount, setTargetAmount] = useState("");
  const [selectedDenominations, setSelectedDenominations] = useState([]);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [unreachable, setUnreachable] = useState(false);

  const handleDenominationChange = (denomination) => {
    setSelectedDenominations((prev) =>
      prev.includes(denomination)
        ? prev.filter((d) => d !== denomination)
        : [...prev, denomination]
    );
  };

  const handleAmountChange = (value) => {
    setTargetAmount(value);

    // Validate the target amount
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0 || amount > 10000) {
      setAmountError("Target amount must be a number between 0 and 10000.");
      setIsSubmitDisabled(true);
    } else {
      setAmountError("");
      setIsSubmitDisabled(selectedDenominations.length === 0);
    }
  };

  const handleDenominationSelection = () => {
    setIsSubmitDisabled(
      amountError !== "" || selectedDenominations.length === 0
    );
  };
  const API_URL = "http://backend:8080/api";
	
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult([]);
    setUnreachable(false); // Reset unreachable state

    try {
      const response = await fetch("http://3.27.234.183:8080/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAmount: parseFloat(targetAmount),
          coinDenominations: selectedDenominations,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.length === 0) {
        // If the result array is empty, target amount is unreachable
        setUnreachable(true);
      } else {
        // Sort and display the result
        const sortedResult = data.sort((a, b) => a - b);
        setResult(sortedResult);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Coin Calculator</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Target Amount:</label>
          <input
            type="number"
            step="0.01"
            value={targetAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            required
          />
          {amountError && <div className="error">{amountError}</div>}
        </div>
        <div className="form-group">
          <label>Coin Denominations:</label>
          <div className="checkbox-group">
            {AVAILABLE_DENOMINATIONS.map((denomination) => (
              <div key={denomination}>
                <label>
                  <input
                    type="checkbox"
                    value={denomination}
                    checked={selectedDenominations.includes(denomination)}
                    onChange={() => {
                      handleDenominationChange(denomination);
                      handleDenominationSelection();
                    }}
                  />
                  {denomination}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" disabled={isSubmitDisabled}>
          Calculate
        </button>
      </form>

      {error && <div className="error">Error: {error}</div>}

      {unreachable && (
        <div className="warning">
          The target amount cannot be reached with the selected denominations.
        </div>
      )}

      {result.length > 0 && (
        <div className="result">
          <h2>Result</h2>
          <p>
            Minimum Coins: <strong>{result.join(", ")}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
