import { useState } from "react";

const API_BASE = "http://localhost:8000";

function MonthModal({ month, birthdays, onClose, isDay = false, onBirthdayDeleted }) {
  const [selectedBirthday, setSelectedBirthday] = useState(birthdays.length === 1 ? birthdays[0] : null);
  const [deletingId, setDeletingId] = useState(null);

  const calculateAge = (birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const getDaysAway = (date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const bdate = new Date(date);
    let bdayThisYear = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
    if (bdayThisYear < today) bdayThisYear.setFullYear(today.getFullYear() + 1);
    return Math.ceil((bdayThisYear - today) / (1000 * 60 * 60 * 24));
  };

  const handleDelete = async (e, bdayId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this birthday?")) return;

    setDeletingId(bdayId);
    try {
      const res = await fetch(`${API_BASE}/birthdays/${bdayId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (onBirthdayDeleted) onBirthdayDeleted();
        onClose();
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to delete birthday.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const getAvClass = (index) => `av${(index % 8) + 1}`;

  const renderDetail = (birthday, index) => {
    const age = calculateAge(birthday.date);
    const days = getDaysAway(birthday.date);
    return (
      <div key={birthday.bday_id} className="detail-view">
        <div className="d-head">
          <div className={`bav d-av ${getAvClass(index)}`} style={{ width: '50px', height: '50px', fontSize: '16px' }}>{getInitials(birthday.name)}</div>
          <div>
            <div className="d-n">{birthday.name}</div>
            <div className="d-s">{new Date(birthday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
        <div className="d-stats">
          <div className="ds"><div className="ds-n">{age}</div><div className="ds-l">Turning</div></div>
          <div className="ds"><div className="ds-n">{days}</div><div className="ds-l">Days away</div></div>
          <div className="ds"><div className="ds-n">🎂</div><div className="ds-l">Celebrate!</div></div>
        </div>
        <div className="d-act">
          <button className="btn-ic" title="Send wish">💌</button>
          <button className="btn-ic" title="Edit">✏️</button>
          <button className="btn-ic" title="Delete" onClick={(e) => handleDelete(e, birthday.bday_id)} disabled={deletingId === birthday.bday_id}>
            {deletingId === birthday.bday_id ? "..." : "🗑️"}
          </button>
          <button className="btn-p" style={{ flex: 1, padding: '9px 14px', fontSize: '13px', borderRadius: '8px' }}>Set Reminder 🔔</button>
        </div>
        {birthdays.length > 1 && (
          <button className="btn-c" style={{ marginTop: '15px', width: '100%' }} onClick={() => setSelectedBirthday(null)}>Back to list</button>
        )}
      </div>
    );
  };

  return (
    <div className="overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="m-x" onClick={onClose}>×</button>
        {selectedBirthday ? (
          renderDetail(selectedBirthday, birthdays.indexOf(selectedBirthday))
        ) : (
          <>
            <div className="m-title">Birthdays in {month}</div>
            <div className="m-sub">{birthdays.length} people celebrating</div>
            <div className="blist" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {birthdays.map((b, i) => (
                <div key={b.bday_id} className="brow" onClick={() => setSelectedBirthday(b)}>
                  <div className={`bav ${getAvClass(i)}`}>{getInitials(b.name)}</div>
                  <div className="bi">
                    <div className="bn">{b.name}</div>
                    <div className="bd">{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div className={`badge ${getDaysAway(b.date) < 7 ? 'bs' : 'bw'}`}>{getDaysAway(b.date)}d</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MonthModal;