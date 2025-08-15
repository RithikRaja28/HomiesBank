import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Balances() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [balances, setBalances] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [amountToAdd, setAmountToAdd] = useState("");

  const fetchBalances = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/balances");
      setBalances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users");
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalances();
    if (user?.role === "ADMIN") fetchAllUsers();
  }, []);

  const handlePayDebts = async (username) => {
    setLoadingUser(username);
    try {
      await axios.post(
        `http://localhost:8080/api/balances/pay-debt?username=${username}`
      );
      fetchBalances();
      alert(`${username}'s debts paid successfully!`);
    } catch (err) {
      console.error(err);
      alert("Error paying debts");
    }
    setLoadingUser("");
  };

  const handleAddBalance = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/balances/add?username=${selectedUser}&amount=${parseFloat(
          amountToAdd
        )}`
      );
      fetchBalances();
      setShowModal(false);
      setSelectedUser("");
      setAmountToAdd("");
      alert(`₹${amountToAdd} added to ${selectedUser}'s balance`);
    } catch (err) {
      console.error(err);
      alert("Error adding balance");
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center text-primary">Housemates Balances</h3>

      {user?.role === "ADMIN" && (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-primary shadow-sm"
              onClick={() => setShowModal(true)}
            >
              Add Balance
            </button>
          </div>

          {showModal && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 rounded shadow">
                  <h5 className="mb-3">Add Balance</h5>
                  <select
                    className="form-select mb-3"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {allUsers
                      .filter((u) => u.role === "HOUSEMATE")
                      .map((u) => (
                        <option key={u.id} value={u.username}>
                          {u.username}
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Enter amount"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                  />
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={handleAddBalance}
                      disabled={
                        !selectedUser ||
                        !amountToAdd ||
                        parseFloat(amountToAdd) <= 0
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="row">
        {balances.length > 0 ? (
          balances.map((b) => (
            <div key={b.username} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="card-title text-truncate">{b.username}</h6>
                    <p className="card-text fw-bold">₹{b.amount.toFixed(2)}</p>
                  </div>
                  {user?.role === "ADMIN" && (
                    <button
                      className="btn btn-success btn-sm mt-2"
                      disabled={loadingUser === b.username}
                      onClick={() => handlePayDebts(b.username)}
                    >
                      {loadingUser === b.username
                        ? "Processing..."
                        : "Pay Debt"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No balances found</p>
          </div>
        )}
      </div>
    </div>
  );
}
