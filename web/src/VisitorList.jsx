import { useState, useEffect } from "react";
import { getVisitors, checkOut, deactivateVisitor } from "./api";
import { formatTime, formatDate } from "./timeUtils";

export default function VisitorList({ onRefresh }) {
  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    getVisitors(page)
      .then((data) => {
        if (data) {
          setVisitors(data.visitors);
          setTotal(data.total);
          setPerPage(data.perPage);
          if (data.visitors.length === 0 && page > 1) {
            setPage(1);
          }
        } else {
          setError("Failed to load visitors");
        }
      })
      .catch(() => setError("Failed to load visitors"))
      .finally(() => setLoading(false));
  }, [page, onRefresh]);

  const totalPages = Math.ceil(total / perPage);

  async function handleCheckOut(id) {
    setActionLoading(id);
    try {
      await checkOut(id);
      setVisitors((prev) => prev.filter((v) => v.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch {
      setError("Failed to check out visitor");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeactivate(id) {
    setActionLoading(id);
    try {
      await deactivateVisitor(id);
      setVisitors((prev) => prev.filter((v) => v.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch {
      setError("Failed to deactivate visitor");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <h2>Active Visitors</h2>
      {error && (
        <div style={{ color: "#d32f2f", background: "#ffebee", padding: "8px 12px", marginBottom: "12px", borderRadius: "4px" }}>
          {error}
        </div>
      )}
      {loading ? (
        <p>Loading visitors…</p>
      ) : visitors.length === 0 ? (
        <p>No active visitors.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: "140px" }}>Name</th>
              <th style={{ ...th, width: "140px" }}>Company</th>
              <th style={{ ...th, width: "140px" }}>Host</th>
              <th style={{ ...th, width: "190px" }}>Purpose</th>
              <th style={{ ...th, width: "110px" }}>Date</th>
              <th style={{ ...th, width: "90px" }}>Checked In</th>
              <th style={{ ...th, width: "170px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v.id}>
                <td style={{ ...td, width: "140px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {v.full_name}
                  {v.repeat && (
                    <span style={{ marginLeft: "6px", background: "#e3f2fd", color: "#1565c0", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", whiteSpace: "nowrap" }}>
                      Repeat
                    </span>
                  )}
                </td>
                <td style={{ ...td, width: "140px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.company_name}</td>
                <td style={{ ...td, width: "140px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.host_name}</td>
                <td style={{ ...td, width: "190px" }}>{v.purpose}</td>
                <td style={{ ...td, width: "110px", whiteSpace: "nowrap" }}>{formatDate(v.checked_in_at)}</td>
                <td style={{ ...td, width: "90px", whiteSpace: "nowrap" }}>{formatTime(v.checked_in_at)}</td>
                <td style={{ ...td, width: "170px", whiteSpace: "nowrap", padding: "4px 6px" }}>
                  <button
                    onClick={() => handleCheckOut(v.id)}
                    disabled={actionLoading === v.id}
                    style={{ padding: "4px 8px", marginRight: "4px", whiteSpace: "nowrap" }}
                  >
                    {actionLoading === v.id ? "…" : "Check Out"}
                  </button>
                  <button
                    onClick={() => handleDeactivate(v.id)}
                    disabled={actionLoading === v.id}
                    style={{ padding: "4px 8px", whiteSpace: "nowrap" }}
                  >
                    {actionLoading === v.id ? "…" : "Deactivate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && visitors.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </button>
          <span style={{ margin: "0 12px" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const th = { borderBottom: "1px solid #ccc", padding: "8px 8px", textAlign: "left", fontSize: "14px", fontWeight: "600", lineHeight: "1.5" };
const td = { padding: "8px 8px", borderBottom: "1px solid #eee", lineHeight: "1.5", fontSize: "14px", verticalAlign: "middle" };
