import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Balances() {
  const [balances, setBalances] = useState([]);
  const [loadingUser, setLoadingUser] = useState(""); // loading for a specific user

  const fetchBalances = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/balances");
      setBalances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const handlePayDebts = async (username) => {
    setLoadingUser(username);
    try {
      await axios.post(
        `http://localhost:8080/api/balances/pay-debt?username=${username}`
      ); // add 's' in balances
      alert(`${username}'s debts paid successfully!`);
      fetchBalances(); // refresh balances
      await axios.get("http://localhost:8080/api/transactions/owe-matrix"); // optional refresh
    } catch (err) {
      console.error(err);
      alert("Error paying debts");
    }
    setLoadingUser("");
  };


  return (
    <div className="table-responsive">
      <h3>Housemates Balances</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Balance (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {balances.length > 0 ? (
            balances.map((b) => (
              <tr key={b.username}>
                <td>{b.username}</td>
                <td>₹{b.amount.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-success"
                    disabled={loadingUser === b.username}
                    onClick={() => handlePayDebts(b.username)}
                  >
                    {loadingUser === b.username ? "Processing..." : "Pay Debt"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No balances found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
