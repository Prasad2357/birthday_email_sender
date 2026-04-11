import { useState, useEffect } from "react";
import "../css/AddBirthdayModal.css";

const API_BASE = "http://localhost:8001";

function AddBirthdayModal({ selectedDate, onClose, onAddSuccess }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(selectedDate || "");
  const [status, setStatus] = useState(null); // { type: 'error'|'success'|'duplicate', message }
  const [loading, setLoading] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);

  useEffect(() => {
    if (selectedDate) setDate(selectedDate);
  }, [selectedDate]);

  // Auto-dismiss success after 2s
  useEffect(() => {
    if (status?.type === "success") {
      const t = setTimeout(() => {
        onAddSuccess();
        onClose();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setDuplicateInfo(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/birthdays/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), date }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Duplicate found by backend
        setDuplicateInfo(data.detail);
        setStatus({
          type: "duplicate",
          message: data.detail,
        });
      } else if (!res.ok) {
        setStatus({ type: "error", message: data.detail || "Something went wrong." });
      } else {
        setStatus({ type: "success", message: `🎉 "${data.name}" added successfully!` });
        setName("");
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error. Is the backend running?" });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display in title: e.g. "April 11"
  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : "";

  return (
    <div className="abm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="abm-modal" role="dialog" aria-modal="true" aria-labelledby="abm-title">
        {/* Header */}
        <div className="abm-header">
          <div className="abm-title-group">
            <span className="abm-cake">🎂</span>
            <div>
              <h2 id="abm-title">Add Birthday</h2>
              {formattedDate && <p className="abm-subtitle">{formattedDate}</p>}
            </div>
          </div>
          <button className="abm-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Status Banner */}
        {status && (
          <div className={`abm-alert abm-alert--${status.type}`}>
            {status.type === "success" && <span className="abm-alert-icon">✅</span>}
            {status.type === "error" && <span className="abm-alert-icon">❌</span>}
            {status.type === "duplicate" && <span className="abm-alert-icon">⚠️</span>}
            <span>{status.message}</span>
          </div>
        )}

        {/* Form */}
        <form className="abm-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="abm-field">
            <label htmlFor="abm-name">Name</label>
            <input
              id="abm-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              disabled={loading || status?.type === "success"}
            />
          </div>

          <div className="abm-field">
            <label htmlFor="abm-date">Date</label>
            <input
              id="abm-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading || status?.type === "success"}
            />
          </div>

          <div className="abm-actions">
            <button type="button" className="abm-btn abm-btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="abm-btn abm-btn--submit"
              disabled={loading || status?.type === "success"}
            >
              {loading ? (
                <span className="abm-spinner" />
              ) : status?.type === "success" ? (
                "Added! ✓"
              ) : (
                "Add Birthday"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBirthdayModal;
