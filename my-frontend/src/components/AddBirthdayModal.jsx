import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000";

function AddBirthdayModal({ selectedDate, onClose, onAddSuccess }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(selectedDate || "");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDate) setDate(selectedDate);
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/birthdays/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), date, relationship: relationship.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to add birthday");
      }

      onAddSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="m-x" onClick={onClose}>×</button>
        <div className="m-icon">🎂</div>
        <div className="m-title">Add a Birthday</div>
        <div className="m-sub">Who's celebrating next? 🎉</div>
        
        {error && <div style={{ color: 'var(--r)', fontSize: '12px', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="fg">
            <label className="fl">Full Name</label>
            <input 
              className="fi" 
              type="text" 
              placeholder="Enter their full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="fg">
            <label className="fl">Date of Birth</label>
            <input 
              className="fi" 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="fg">
            <label className="fl">Relationship (optional)</label>
            <input 
              className="fi" 
              type="text" 
              placeholder="Friend, Family, Colleague..."
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            />
          </div>
          <div className="ma">
            <button type="button" className="btn-c" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-p" disabled={loading}>
              {loading ? "Adding..." : "🎉 Add Birthday"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBirthdayModal;
