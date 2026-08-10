import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import img from "../assets/taxi_illustration.png"
import { registerUser } from '../api/auth';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    is_driver: false,
    phone_no: "",
  });

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  }

  function handleFileChange(e) {
    setProfile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile) {
      setError("Profile image is required");
      return;
    }

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("profile", profile);
      data.append("is_driver", formData.is_driver);
      if (formData.phone_no) data.append("phone_no", formData.phone_no);

      await registerUser(data);
      setSuccess("Registration successful. You can now login.");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.detail || "Registration failed. Check your inputs");
    }
  }

  return (
    <div className="signup-page container-fluid py-5">
      <div className="row gx-5 gy-4 align-items-center justify-content-center">
        {error && <div className="alert alert-danger w-100">{error}</div>}
        {success && <div className="alert alert-success w-100">{success}</div>}

        <div className="col-12 col-lg-6">
          <img src={img} className="signup-img" alt="Driver" />
        </div>

        <div className="col-12 col-lg-6">
          <div className="signup-form-wrapper">
            <div className="signup-intro mb-4">
              <span className="eyebrow">Get started — it's free</span>
              <h1 className="signup-heading">Your journey starts here. Take the first step.</h1>
              <p className="text-muted mt-2">Create your account to access rides, and enjoy seamless travel.</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row g-2 mb-1">
                <div className="col-6">
                  <input type="text" name="first_name" placeholder="First Name"
                    onChange={handleChange} value={formData.first_name} className="form-control" required />
                </div>
                <div className="col-6">
                  <input type="text" name="last_name" placeholder="Last Name"
                    onChange={handleChange} value={formData.last_name} className="form-control" required />
                </div>
              </div>

              <input type="email" name="email" placeholder="Email"
                onChange={handleChange} value={formData.email} className="form-control my-3" required />

              <div className="position-relative my-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="form-control"
                  required
                />
                <button type="button" className="btn icon-btn position-absolute"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <LuEye /> : <LuEyeClosed />}
                </button>
              </div>

              <input type="file" accept="image/*" onChange={handleFileChange}
                className="form-control my-3" />

              <input type="tel" name="phone_no" placeholder="Phone (optional)"
                onChange={handleChange} value={formData.phone_no} className="form-control my-3" />

              <div className="form-check my-3">
                <input
                  type="checkbox"
                  name="is_driver"
                  checked={formData.is_driver}
                  onChange={handleChange}
                  className="form-check-input"
                  id="registerAsDriver"
                />
                <label className="form-check-label ms-2" htmlFor="registerAsDriver">
                  Register as Driver
                </label>
              </div>

              <button className="btn btn-primary w-100 mt-1" type='submit'>Create Account</button>
            </form>

            <p className="text-center mt-4 mb-0 small text-muted">
              Already have an account?{' '}
              <Link to="/login" className="fw-bold text-dark text-decoration-none">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup