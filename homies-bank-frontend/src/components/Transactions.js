import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export default function Transactions({ showMatrixOnly }) {
  const [users, setUsers] = useState([]);
  const [payer, setPayer] = useState("");
  const [payees, setPayees] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [oweMatrix, setOweMatrix] = useState([]);

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));

    if (showMatrixOnly) fetchOweMatrix();
  }, [showMatrixOnly]);

  const fetchOweMatrix = () => {
    axios
      .get(`${API_URL}/api/transactions/owe-matrix`)
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
      await axios.post(`${API_URL}/api/transactions`, transaction);
      alert("Transaction added!");
      setPayer("");
      setPayees([]);
      setDescription("");
      setDate("");
      setAmount("");
      fetchOweMatrix();
    } catch (err) {
      console.error(err);
      alert("Error adding transaction");
    }
  };

  const handleUpdate = async () => {
    if (!selectedRecord || !amountPaid) {
      alert("Please enter amount");
      return;
    }

    try {
      await axios.put(`${API_URL}/api/owe/update`, null, {
        params: {
          debtor: selectedRecord.fromUser,
          payer: selectedRecord.toUser,
          amountPaid: amountPaid,
        },
      });
      alert("Owe record updated!");
      setShowUpdateModal(false);
      setAmountPaid("");
      fetchOweMatrix();
    } catch (err) {
      console.error(err);
      alert("Error updating record");
    }
  };

  return (
    <div className="container my-4">
      {!showMatrixOnly && (
        <div className="card shadow-sm p-4 mb-4">
          <h4 className="mb-3 text-primary">Add Transaction</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Total Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
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

              <div className="col-12">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="col-12">
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

              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary shadow-sm">
                  Add Transaction
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showMatrixOnly && (
        <div className="card shadow-sm p-3">
          <h4 className="mb-3 text-primary">Owe Matrix</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>From User</th>
                  <th>To User</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Action</th>
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
                      <td>{new Date(row.date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setSelectedRecord(row);
                            setShowUpdateModal(true);
                          }}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No debts yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Owe Record</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>{selectedRecord.fromUser}</strong> owes{" "}
                  <strong>{selectedRecord.toUser}</strong>
                </p>
                <p>
                  Current Amount: ₹
                  {parseFloat(selectedRecord.amount).toFixed(2)}
                </p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount paid"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
