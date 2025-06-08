// import { useEffect, useState } from "react";
// import "../css/MonthModal.css";

// const MONTH_NAMES = [
//   "", "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// function MonthModal({ month, onClose }) {
//   const [monthBirthdays, setMonthBirthdays] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:8000/birthdays/month/${month}`)
//       .then(res => res.json())
//       .then(data => setMonthBirthdays(data))
//       .catch(err => console.error("Failed to fetch birthdays:", err));
//   }, [month]);

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Birthdays in {MONTH_NAMES[month]}</h2>

//         {monthBirthdays.length === 0 ? (
//           <p>No birthdays this month.</p>
//         ) : (
//           <ul>
//             {monthBirthdays.map(b => (
//               <li key={b.bday_id}>
//                 {b.name} - {new Date(b.date).toLocaleDateString()}
//               </li>
//             ))}
//           </ul>
//         )}

//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// }

// export default MonthModal;


import { useState } from "react";
import "../css/MonthModal.css";
import BirthdayCard from "./BirthdayCard";
import { X, Gift } from "lucide-react";

function MonthModal({ month, birthdays, onClose, isDay = false }) {
  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
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
          {birthdays.length === 0 ? (
            <div className="no-birthdays-container">
              <div className="gift-icon-container">
                <Gift className="large-icon" />
              </div>
              <p>No birthdays found for this {isDay ? "day" : "month"}.</p>
            </div>
          ) : (
            <div className="birthday-list-container">
              {birthdays.map((birthday) => (
                <BirthdayCard
                  key={birthday.bday_id}
                  birthday={birthday}
                  age={calculateAge(birthday.date)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="birthday-count">
            {birthdays.length} {birthdays.length === 1 ? 'person' : 'people'} with birthdays
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