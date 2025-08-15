import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaHome } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center fw-bold text-primary"
          to="/dashboard"
        >
          <FaHome className="me-2" />
          HomiesBank
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            {user && (
              <li className="nav-item d-flex align-items-center me-3">
                <FaUserCircle className="me-2 text-primary" size={20} />
                <span className="nav-link text-dark mb-0">
                  {user.username} ({user.role})
                </span>
              </li>
            )}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-primary d-flex align-items-center rounded-pill"
                  onClick={logout}
                  style={{ gap: "5px" }}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
