// import React from "react";
// import "../css/MonthGrid.css"; // Create this file for styling

// const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
  
//   function MonthGrid({ onMonthClick }) {
//     return (
//       <div className="grid-container">
//         {months.map((month, index) => (
//           <div key={index} className="month-tile" onClick={() => onMonthClick(index + 1)}>
//             {month}
//           </div>
//         ))}
//       </div>
//     );
//   }

// export default MonthGrid;
  


import React from "react";
import "../css/MonthGrid.css";
import { Gift } from "lucide-react";

function MonthGrid({ onMonthClick, months, getBirthdayCount }) {
  const currentMonth = new Date().getMonth();

  return (
    <div className="grid-container">
      {months.map((month, index) => {
        const birthdayCount = getBirthdayCount(index);
        const isCurrentMonth = currentMonth === index;
        
        return (
          <div 
            key={index} 
            className={`month-tile ${isCurrentMonth ? 'current-month' : ''}`}
            onClick={() => onMonthClick(index)}
          >
            <span className="month-name">{month}</span>
            
            {birthdayCount > 0 ? (
              <div className="birthday-indicator">
                <Gift className="gift-icon" />
                <span>{birthdayCount} {birthdayCount === 1 ? "birthday" : "birthdays"}</span>
              </div>
            ) : (
              <span className="no-birthdays">No birthdays</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MonthGrid;