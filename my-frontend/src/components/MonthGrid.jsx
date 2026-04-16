import React from "react";

function MonthGrid({ onMonthClick, months, getBirthdayCount }) {
  const currentMonth = new Date().getMonth();

  const monthEmojis = [
    "❄️", "💝", "🌸", "🌺", "🌻", "🌊",
    "☀️", "🏖️", "🍂", "🎃", "🍁", "🎄"
  ];

  const maxBirthdays = 20; // For the fill bar visualization

  return (
    <div className="gv">
      <div className="gmonths">
        {months.map((month, index) => {
          const count = getBirthdayCount(index);
          const isCur = index === currentMonth;
          const fillWidth = Math.min(100, (count / maxBirthdays) * 100);

          return (
            <div 
              key={index} 
              className={`mcard ${isCur ? 'cur' : ''}`}
              onClick={() => onMonthClick(index)}
            >
              <div className="mc-em">{monthEmojis[index]}</div>
              <div className="mc-name">{month}</div>
              <div className="mc-ct">{count} birthdays</div>
              <div className="mc-bar">
                <div className="mc-fill" style={{ width: `${fillWidth}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthGrid;