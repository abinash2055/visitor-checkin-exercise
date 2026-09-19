import { useState, useEffect } from "react";
import { createVisitor, searchVisitors, getHosts } from "./api";

export default function RegistrationForm({ onRegistered }) {
  const [form, setForm] = useState({ full_name: "", company_name: "", host_id: "", purpose: "" });
  const [hosts, setHosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setLoading(true);
    getHosts()
      .then((data) => { if (data) setHosts(data); })
      .catch(() => setApiError("Failed to load hosts"))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name in errors) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
    if (name === "full_name" && value.length >= 2) {
      searchVisitors(value)
        .then((data) => { if (data) setSuggestions(data); })
        .catch(() => setSuggestions([]));
    } else if (name === "full_name") {
      setSuggestions([]);
    }
  }

  function fillFromSuggestion(s) {
    setForm((f) => ({
      ...f,
      full_name: s.full_name,
      company_name: s.company_name || f.company_name,
      host_id: s.host_id ? String(s.host_id) : f.host_id,
    }));
    setSuggestions([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setApiError("");

    if (!form.full_name.trim()) {
      setErrors({ full_name: "Full name is required" });
      return;
    }
    if (!form.host_id) {
      setErrors({ host_id: "Host is required" });
      return;
    }

    setLoading(true);
    try {
      await createVisitor({ ...form, host_id: form.host_id || null });
      setForm({ full_name: "", company_name: "", host_id: "", purpose: "" });
      setSuggestions([]);
      onRegistered();
    } catch (err) {
      if (err && err.errors) {
        const formatted = {};
        for (const [key, messages] of Object.entries(err.errors)) {
          formatted[key] = Array.isArray(messages) ? messages.join(", ") : messages;
        }
        setErrors(formatted);
      } else {
        setApiError(err?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <h2>Register Visitor</h2>
      {apiError && (
        <div style={{ color: "#d32f2f", background: "#ffebee", padding: "8px 12px", marginBottom: "12px", borderRadius: "4px" }}>
          {apiError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ position: "relative", marginBottom: "8px" }}>
          <label>Full Name *<br />
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              autoComplete="off"
              style={{ width: "260px" }}
              disabled={loading}
            />
          </label>
          {errors.full_name && (
            <span style={{ color: "#d32f2f", fontSize: "12px" }}>{errors.full_name}</span>
          )}
          {suggestions.length > 0 && (
            <ul style={dropdownStyle}>
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  style={{ padding: "6px 8px", cursor: "pointer" }}
                  onClick={() => fillFromSuggestion(s)}
                >
                  {s.full_name} — {s.company_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>Company<br />
            <input name="company_name" value={form.company_name} onChange={handleChange} style={{ width: "260px" }} disabled={loading} />
          </label>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>Host *<br />
            <select name="host_id" value={form.host_id} onChange={handleChange} required style={{ width: "268px" }} disabled={loading}>
              <option value="">Select host…</option>
              {hosts.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </label>
          {errors.host_id && (
            <span style={{ color: "#d32f2f", fontSize: "12px" }}>{errors.host_id}</span>
          )}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>Purpose<br />
            <textarea name="purpose" value={form.purpose} onChange={handleChange} rows={3} style={{ width: "260px" }} disabled={loading} />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit"}
        </button>
        {loading && <span style={{ marginLeft: "8px" }}>Loading…</span>}
      </form>
    </div>
  );
}

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  background: "#fff",
  border: "1px solid #ccc",
  listStyle: "none",
  margin: 0,
  padding: 0,
  width: "260px",
  zIndex: 10,
};
