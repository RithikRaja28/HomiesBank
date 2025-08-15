import React, { useState } from "react";
import Navbar from "./Navbar";
import Transactions from "./Transactions";
import Balances from "./Balance";
import { motion, AnimatePresence } from "framer-motion";

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
        return <Balances />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        {/* Welcome Card */}
        <div
          className="card shadow-lg rounded-4 p-4 mb-4 border-0 text-center"
          style={{
            background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          }}
        >
          <h2 className="mb-2 text-primary">Welcome, {user?.username} 🎉</h2>
          <p className="mb-1">
            <strong>Role:</strong> {user?.role}
          </p>
        </div>

        {/* Dashboard Card */}
        <div className="card shadow rounded-4 border-0">
          {/* Modern Tabs */}
          <ul className="nav nav-pills nav-fill bg-light rounded-top p-2 flex-wrap">
            <li className="nav-item mb-2 mb-md-0">
              <button
                className={`nav-link ${
                  activeTab === "addTransaction"
                    ? "active bg-primary text-white"
                    : "text-primary"
                } rounded-pill`}
                onClick={() => setActiveTab("addTransaction")}
                disabled={user?.role !== "ADMIN"} // only admin can add transactions
              >
                Add Transaction
              </button>
            </li>
            <li className="nav-item mb-2 mb-md-0">
              <button
                className={`nav-link ${
                  activeTab === "oweMatrix"
                    ? "active bg-primary text-white"
                    : "text-primary"
                } rounded-pill`}
                onClick={() => setActiveTab("oweMatrix")}
              >
                Owe Matrix
              </button>
            </li>
            <li className="nav-item mb-2 mb-md-0">
              <button
                className={`nav-link ${
                  activeTab === "balances"
                    ? "active bg-primary text-white"
                    : "text-primary"
                } rounded-pill`}
                onClick={() => setActiveTab("balances")}
              >
                Balances
              </button>
            </li>
          </ul>

          {/* Tab Content with Smooth Transition */}
          <div className="p-4">
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
