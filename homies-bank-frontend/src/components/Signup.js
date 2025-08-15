import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserAlt, FaLock, FaUserTag } from "react-icons/fa";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HOUSEMATE"); // default role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users/signup", {
        username,
        password,
        role,
      });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg rounded-4 p-5"
        style={{
          maxWidth: "400px",
          width: "100%",
          border: "none",
          backgroundColor: "#fff",
        }}
      >
        <h2 className="text-center text-dark mb-3 fw-bold">Create Account</h2>
        <p className="text-center text-muted mb-4">
          Fill in your details to sign up
        </p>

        <form onSubmit={handleSignup}>
          <div className="mb-3 position-relative">
            <FaUserAlt
              className="position-absolute"
              style={{
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                color: "#adb5bd",
              }}
            />
            <input
              type="text"
              className="form-control ps-5 rounded-pill"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ height: "45px", border: "1.5px solid #dee2e6" }}
            />
          </div>

          <div className="mb-3 position-relative">
            <FaLock
              className="position-absolute"
              style={{
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                color: "#adb5bd",
              }}
            />
            <input
              type="password"
              className="form-control ps-5 rounded-pill"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ height: "45px", border: "1.5px solid #dee2e6" }}
            />
          </div>

          <div className="mb-3 position-relative">
            <FaUserTag
              className="position-absolute"
              style={{
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                color: "#adb5bd",
              }}
            />
            <select
              className="form-control ps-5 rounded-pill"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ height: "45px", border: "1.5px solid #dee2e6" }}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="HOUSEMATE">HOUSEMATE</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-pill fw-bold"
            style={{
              height: "45px",
              fontSize: "16px",
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              border: "none",
              color: "#fff",
            }}
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-muted">Already have an account? </span>
          <Link
            to="/login"
            className="text-primary fw-bold text-decoration-none"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
