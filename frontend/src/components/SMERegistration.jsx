import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.js";

const BUSINESS_TYPES = ["Retail", "Manufacturing", "Services", "Agriculture"];

export default function SMERegistration({ onRegistered }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sme_name: "",
    business_type: "",
    location: "Urban",
    employees: "",
    years_operation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.sme_name || !form.business_type || !form.employees || !form.years_operation) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.registerSme(form);
      const registered = { id: result.id, sme_name: form.sme_name, business_type: form.business_type };
      onRegistered(registered);
      navigate("/assessment");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">SME Registration</h1>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>SME Registration Form</h2>
        <p className="page-subtitle">
          Register your small or medium enterprise to begin the digital readiness assessment.
        </p>

        <form onSubmit={handleSubmit}>
          <label>SME Name *</label>
          <input
            type="text"
            placeholder="e.g., Perera Trading"
            value={form.sme_name}
            onChange={(e) => update("sme_name", e.target.value)}
          />

          <label>Business Type *</label>
          <select
            value={form.business_type}
            onChange={(e) => update("business_type", e.target.value)}
          >
            <option value="">Select business type</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label>Location *</label>
          <div className="toggle-group">
            {["Urban", "Rural"].map((loc) => (
              <button
                type="button"
                key={loc}
                className={`toggle-btn ${form.location === loc ? "active" : ""}`}
                onClick={() => update("location", loc)}
              >
                {loc}
              </button>
            ))}
          </div>

          <label>Number of Employees *</label>
          <input
            type="number"
            min="1"
            placeholder="e.g., 25"
            value={form.employees}
            onChange={(e) => update("employees", e.target.value)}
          />

          <label>Years of Operation *</label>
          <input
            type="number"
            min="0"
            placeholder="e.g., 5"
            value={form.years_operation}
            onChange={(e) => update("years_operation", e.target.value)}
          />

          {error && <p style={{ color: "#dc2626", marginTop: 12 }}>{error}</p>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register SME"}
          </button>
        </form>
      </div>
    </div>
  );
}
