import React from "react";

function CalendarView({
  birthdays,
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  onAddClick,
  onBirthdayClick,
  months
}) {
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const getPrevMonthDays = (year, month) => new Date(year, month, 0).getDate();

  const getBirthdaysForDay = (day, month = currentMonth, year = currentYear) =>
    birthdays.filter((b) => {
      const d = new Date(b.date);
      return d.getMonth() === month && d.getDate() === day;
    });

  const buildIso = (day) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const cm = (dir) => {
    let newMonth = currentMonth + dir;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    else if (newMonth < 0) { newMonth = 11; newYear--; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 1);
  const getAvClass = (index) => `av${(index % 8) + 1}`;

  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const prevMonthDays = getPrevMonthDays(currentYear, currentMonth);
  const today = new Date();

  const cells = [];
  // Leading empty cells
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(
      <div key={`prev-${i}`} className="cell om">
        <div className="dn">{prevMonthDays - i}</div>
      </div>
    );
  }

  // Current month cells
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
    const dayBirthdays = getBirthdaysForDay(d);
    
    cells.push(
      <div 
        key={`curr-${d}`} 
        className={`cell ${isToday ? 'today' : ''}`}
        onClick={() => dayBirthdays.length > 0 && onBirthdayClick(dayBirthdays, d, currentMonth)}
      >
        <div className="dn">{d}</div>
        {dayBirthdays.length > 0 && (
          <div className="bdots">
            {dayBirthdays.map((b, i) => (
              <div key={i} className={`bdot ${getAvClass(i)}`}>{getInitials(b.name)}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Trailing empty cells
  const totalCells = firstDay + daysInMonth;
  const rem = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= rem; d++) {
    cells.push(
      <div key={`next-${d}`} className="cell om">
        <div className="dn">{d}</div>
      </div>
    );
  }

  return (
    <div className="cal-card">
      <div className="cal-head">
        <div className="cal-title">{months[currentMonth]} {currentYear}</div>
        <div className="cal-nav">
          <button className="cal-nb" onClick={() => cm(-1)}>‹</button>
          <button className="cal-nb" onClick={() => cm(1)}>›</button>
        </div>
      </div>
      <div className="cal-body">
        <div className="cal-dh">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="cal-dl">{d}</div>
          ))}
        </div>
        <div className="cal-cells">
          {cells}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;