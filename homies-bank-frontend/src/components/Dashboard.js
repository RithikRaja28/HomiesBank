import React, { useState } from "react";
import Navbar from "./Navbar";
import Transactions from "./Transactions";
import Balances from "./Balance";
// new component for balance

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("addTransaction"); // default tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "addTransaction":
        return <Transactions showMatrixOnly={false} />;
      case "oweMatrix":
        return <Transactions showMatrixOnly={true} />;
      case "balances":
        return <Balances/>;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="mb-4">Welcome, {user?.username} 🎉</h2>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
          <p>
            <strong>User ID:</strong> {user?.id}
          </p>

          {/* Tabs */}
          <ul className="nav nav-tabs mt-4">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "addTransaction" ? "active" : ""
                }`}
                onClick={() => setActiveTab("addTransaction")}
              >
                Add Transaction
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "oweMatrix" ? "active" : ""
                }`}
                onClick={() => setActiveTab("oweMatrix")}
              >
                Owe Matrix
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "balances" ? "active" : ""
                }`}
                onClick={() => setActiveTab("balances")}
              >
                Balances
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="mt-4">{renderTabContent()}</div>
        </div>
      </div>
    </>
  );
}
