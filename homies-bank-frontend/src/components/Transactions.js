import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions({ showMatrixOnly }) {
  const [users, setUsers] = useState([]);
  const [payer, setPayer] = useState("");
  const [payees, setPayees] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [oweMatrix, setOweMatrix] = useState([]);

  // Fetch all users
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));

    fetchOweMatrix();
  }, []);

  const fetchOweMatrix = () => {
    axios
      .get("http://localhost:8080/api/transactions/owe-matrix")
      .then((res) => setOweMatrix(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!payer || !amount || payees.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    const payeesData = payees.map((username) => ({
      username,
      amountOwed: (amount / (payees.length + 1)).toFixed(2),
    }));

    const transaction = {
      date,
      description,
      payer,
      totalAmount: parseFloat(amount),
      payees: payeesData,
    };

    try {
      await axios.post("http://localhost:8080/api/transactions", transaction);
      alert("Transaction added!");
      setPayer("");
      setPayees([]);
      setDescription("");
      setDate("");
      setAmount("");
      fetchOweMatrix(); // Refresh matrix
    } catch (err) {
      console.error(err);
      alert("Error adding transaction");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Transaction</h2>
      {!showMatrixOnly && (
        <form
          onSubmit={handleSubmit}
          className="p-3 border rounded bg-light mb-4"
        >
          {/* Date */}
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Payer */}
          <div className="mb-3">
            <label className="form-label">Payer</label>
            <select
              className="form-select"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              required
            >
              <option value="">-- Select Payer --</option>
              {users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Total Amount */}
          <div className="mb-3">
            <label className="form-label">Total Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Payees */}
          <div className="mb-3">
            <label className="form-label">Payees (who owe money)</label>
            <select
              multiple
              className="form-select"
              value={payees}
              onChange={(e) =>
                setPayees([...e.target.selectedOptions].map((o) => o.value))
              }
              required
            >
              {users
                .filter((user) => user.username !== payer)
                .map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
            </select>
            <small className="text-muted">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple
            </small>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary">
            Add Transaction
          </button>
        </form>
      )}
      {/* Owe Matrix Table */}
      {/* Owe Matrix Table */}
      {/* Owe Matrix Table */}
      <h3>Owe Matrix</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>From User</th>
              <th>To User</th>
              <th>Amount</th>
              <th>Description</th> {/* new column */}
              <th>Date</th> {/* new column */}
            </tr>
          </thead>
          <tbody>
            {oweMatrix.length > 0 ? (
              oweMatrix.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.fromUser}</td>
                  <td>{row.toUser}</td>
                  <td>₹{parseFloat(row.amount).toFixed(2)}</td>
                  <td>{row.description}</td>
                  <td>{new Date(row.date).toLocaleDateString()}</td>{" "}
                  {/* format date */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No debts yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
