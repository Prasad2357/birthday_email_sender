import React, { useState } from "react";
import "../css/CalendarView.css";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

function CalendarView({
  birthdays,
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  onAddClick,       // (isoDate) → open Add Birthday modal
  onBirthdayClick,  // (birthday[]) → show day-detail modal
  months
}) {
  const [highlightedDay, setHighlightedDay] = useState(null);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const getBirthdaysForDay = (day) =>
    birthdays.filter((b) => {
      const d = new Date(b.date);
      return d.getMonth() === currentMonth && d.getDate() === day;
    });

  const buildIso = (day) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
    setHighlightedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
    setHighlightedDay(null);
  };

  // Plus button → add birthday modal
  const handleAddClick = (e, day) => {
    e.stopPropagation();
    setHighlightedDay(day);
    onAddClick(buildIso(day));
  };

  // Birthday name chip → show detail modal for that day
  const handleBirthdayChipClick = (e, day) => {
    e.stopPropagation();
    setHighlightedDay(day);
    onBirthdayClick(getBirthdaysForDay(day), day, currentMonth);
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const trailingEmpty = (7 - ((firstDay + daysInMonth) % 7)) % 7;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button" onClick={handlePrevMonth}>
          <ChevronLeft className="icon" />
        </button>
        <h2 className="current-month-year">{months[currentMonth]} {currentYear}</h2>
        <button className="nav-button" onClick={handleNextMonth}>
          <ChevronRight className="icon" />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="days-header">
          {dayNames.map((d, i) => <div key={i} className="day-name">{d}</div>)}
        </div>

        <div className="days-grid">
          {/* Leading empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-start-${i}`} className="calendar-day empty" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayBirthdays = getBirthdaysForDay(day);
            const hasBirthday = dayBirthdays.length > 0;
            const isHighlighted = day === highlightedDay;

            return (
              <div
                key={`day-${day}`}
                className={`calendar-day ${hasBirthday ? "has-birthday" : ""} ${isHighlighted ? "highlighted" : ""}`}
              >
                {/* Top row: day number + plus button */}
                <div className="day-top-row">
                  <span className="day-number">{day}</span>
                  <button
                    className="day-add-btn"
                    onClick={(e) => handleAddClick(e, day)}
                    title={`Add birthday on ${months[currentMonth]} ${day}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Birthday chips */}
                {hasBirthday && (
                  <div className="day-birthdays">
                    {dayBirthdays.slice(0, 2).map((birthday, idx) => (
                      <div
                        key={idx}
                        className="day-birthday-item"
                        onClick={(e) => handleBirthdayChipClick(e, day)}
                        title={`View ${birthday.name}'s details`}
                      >
                        <div className="avatar-mini">{birthday.name.charAt(0)}</div>
                        <span className="name-preview">{birthday.name}</span>
                      </div>
                    ))}
                    {dayBirthdays.length > 2 && (
                      <div
                        className="more-birthdays"
                        onClick={(e) => handleBirthdayChipClick(e, day)}
                      >
                        +{dayBirthdays.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Trailing empty cells */}
          {Array.from({ length: trailingEmpty }).map((_, i) => (
            <div key={`empty-end-${i}`} className="calendar-day empty" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;