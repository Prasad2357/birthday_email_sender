import { useState } from "react";
import "../css/MonthModal.css";
import BirthdayCard from "./BirthdayCard";
import { X, Gift } from "lucide-react";

const API_BASE = "http://localhost:8000";

function MonthModal({ month, birthdays, onClose, isDay = false, onBirthdayDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [localBirthdays, setLocalBirthdays] = useState(birthdays);

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleDelete = async (bdayId) => {
    if (!window.confirm("Are you sure you want to delete this birthday?")) return;

    setDeletingId(bdayId);
    try {
      const res = await fetch(`${API_BASE}/birthdays/${bdayId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from local state for instant UI feedback
        setLocalBirthdays((prev) => prev.filter((b) => b.bday_id !== bdayId));
        // Notify parent to refresh data
        if (onBirthdayDeleted) onBirthdayDeleted();
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to delete birthday.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Network error. Is the backend running?");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Birthdays in {month}</h3>
          <button className="close-btn" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>
        
        <div className="modal-body">
          {localBirthdays.length === 0 ? (
            <div className="no-birthdays-container">
              <div className="gift-icon-container">
                <Gift className="large-icon" />
              </div>
              <p>No birthdays found for this {isDay ? "day" : "month"}.</p>
            </div>
          ) : (
            <div className="birthday-list-container">
              {localBirthdays.map((birthday) => (
                <BirthdayCard
                  key={birthday.bday_id}
                  birthday={birthday}
                  age={calculateAge(birthday.date)}
                  onDelete={handleDelete}
                  isDeleting={deletingId === birthday.bday_id}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="birthday-count">
            {localBirthdays.length} {localBirthdays.length === 1 ? 'person' : 'people'} with birthdays
          </div>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MonthModal;