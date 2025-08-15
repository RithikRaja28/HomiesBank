import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/users/login", {
        username,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="card shadow-lg rounded-4 p-5"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#fff",
          border: "none",
        }}
      >
        <h2 className="text-center text-dark mb-3 fw-bold">Welcome Back</h2>
        <p className="text-center text-muted mb-4">
          Login to your account to continue
        </p>

        <form onSubmit={handleLogin}>
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
              style={{
                height: "45px",
                border: "1.5px solid #dee2e6",
                transition: "0.3s",
              }}
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
              style={{
                height: "45px",
                border: "1.5px solid #dee2e6",
                transition: "0.3s",
              }}
            />
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
              transition: "0.3s",
            }}
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-muted">Don’t have an account? </span>
          <Link
            to="/signup"
            className="text-primary fw-bold text-decoration-none"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
