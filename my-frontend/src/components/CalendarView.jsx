import React, { useState } from "react";
import "../css/CalendarView.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CalendarView({ 
  birthdays, 
  currentMonth, 
  currentYear, 
  setCurrentMonth, 
  setCurrentYear, 
  onDayClick,
  months 
}) {
  const [highlightedDay, setHighlightedDay] = useState(null);

  // Function to get days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get birthdays for a specific day
  const getBirthdaysForDay = (day) => {
    return birthdays.filter(birthday => {
      const date = new Date(birthday.date);
      return date.getMonth() === currentMonth && date.getDate() === day;
    });
  };

  // Navigation for calendar view
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setHighlightedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setHighlightedDay(null);
  };

  // Handle day click
  const handleDayClick = (day) => {
    const dayBirthdays = getBirthdaysForDay(day);
    if (dayBirthdays.length > 0) {
      setHighlightedDay(day);
      onDayClick(day, currentMonth);
    }
  };

  // Day names for the calendar header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
        {/* Day names row */}
        <div className="days-header">
          {dayNames.map((day, index) => (
            <div key={index} className="day-name">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="days-grid">
          {/* Empty cells before the first day of the month */}
          {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }).map((_, index) => (
            <div key={`empty-start-${index}`} className="calendar-day empty"></div>
          ))}
          
          {/* Actual days of the month */}
          {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, index) => {
            const day = index + 1;
            const hasBirthday = getBirthdaysForDay(day).length > 0;
            const isHighlighted = day === highlightedDay;
            const dayBirthdays = getBirthdaysForDay(day);
            
            return (
              <div 
                key={`day-${day}`} 
                onClick={() => handleDayClick(day)}
                className={`calendar-day ${hasBirthday ? 'has-birthday' : ''} ${isHighlighted ? 'highlighted' : ''}`}
              >
                <div className="day-number">{day}</div>
                
                {hasBirthday && (
                  <div className="day-birthdays">
                    {dayBirthdays.slice(0, 2).map((birthday, idx) => (
                      <div key={idx} className="day-birthday-item">
                        <div className="avatar-mini">{birthday.name.charAt(0)}</div>
                        <span className="name-preview">{birthday.name}</span>
                      </div>
                    ))}
                    
                    {dayBirthdays.length > 2 && (
                      <div className="more-birthdays">
                        +{dayBirthdays.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Empty cells after the last day of the month */}
          {Array.from({ length: (7 - ((getFirstDayOfMonth(currentYear, currentMonth) + getDaysInMonth(currentYear, currentMonth)) % 7)) % 7 }).map((_, index) => (
            <div key={`empty-end-${index}`} className="calendar-day empty"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;