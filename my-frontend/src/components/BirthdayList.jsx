// import { useEffect, useState } from "react"
// import "../css/BirthdayList.css"
// import MonthGrid from "./MonthGrid"
// import MonthModal from "./MonthModal";

// function BirthdayList() {
//   const [birthdays, setBirthdays] = useState([])
//   const [selectedMonth, setSelectedMonth] = useState(null)

//   useEffect(() => {
//     fetch("http://localhost:8000/birthdays")
//       .then(res => res.json())
//       .then(data => setBirthdays(data))
//   }, [])

//   const handleMonthClick = (month) => {
//     setSelectedMonth(month)
//   }

//   const closeModal = () => {
//     setSelectedMonth(null)
//   }

//   return (
//     <div className="birthday-list">
//       <h3> Browse by Month</h3>
//       <MonthGrid onMonthClick={handleMonthClick} />

//       {selectedMonth &&(
//         <MonthModal
//           month={selectedMonth}
//           onClose={closeModal}
//           />
//       )}
//     </div>
//   )
// }

// export default BirthdayList


import { useState, useEffect } from "react";
import "../css/BirthdayList.css";
import MonthGrid from "./MonthGrid";
import MonthModal from "./MonthModal";
import CalendarView from "./CalendarView";
import { Calendar, Gift } from "lucide-react";

function BirthdayList({ showCalendarView: initialView = false }) {
  const [birthdays, setBirthdays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showCalendarView, setShowCalendarView] = useState(initialView);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Fetch birthday data from your API
    setShowCalendarView(initialView);
    fetch("http://localhost:8000/birthdays")
      .then((res) => res.json())
      .then((data) => setBirthdays(data))
      .catch(err => {
        console.error("Failed to fetch birthdays:", err);
        // Use sample data as fallback
        setBirthdays(sampleBirthdayData);
      });
  }, [initialView]);

  // Sample data for fallback
  const sampleBirthdayData = [
    { bday_id: 1, name: "Prasad", date: "2003-05-02", relationship: "Friend", notes: "Loves video games" },
    { bday_id: 2, name: "Aisha", date: "1995-05-15", relationship: "Colleague", notes: "Prefers gift cards" },
    { bday_id: 3, name: "Miguel", date: "1988-01-27", relationship: "Brother", notes: "Collects records" },
    { bday_id: 4, name: "Sophia", date: "2000-02-24", relationship: "Cousin", notes: "Into photography" },
    { bday_id: 5, name: "Emma", date: "1993-04-05", relationship: "Sister", notes: "Chocolate lover" },
    { bday_id: 6, name: "Carlos", date: "1978-06-30", relationship: "Uncle", notes: "Enjoys fishing" }
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthClick = (monthIndex) => {
    const monthBirthdays = birthdays.filter(birthday => {
      const birthdayMonth = new Date(birthday.date).getMonth();
      return birthdayMonth === monthIndex;
    });
    
    setSelectedMonth({
      monthIndex,
      monthName: months[monthIndex],
      birthdays: monthBirthdays
    });
    
    setSelectedDay(null);
  };

  const handleDayClick = (day, monthIndex) => {
    const monthName = months[monthIndex];
    const dayBirthdays = birthdays.filter(birthday => {
      const date = new Date(birthday.date);
      return date.getMonth() === monthIndex && date.getDate() === day;
    });
    
    setSelectedDay({
      day,
      monthName,
      birthdays: dayBirthdays
    });
  };

  const closeModal = () => {
    setSelectedMonth(null);
    setSelectedDay(null);
  };

  const toggleView = () => {
    setShowCalendarView(prev => !prev);
  };

  // Get count of birthdays this month for the header
  const currentMonthBirthdays = birthdays.filter(birthday => {
    const birthdayMonth = new Date(birthday.date).getMonth();
    return birthdayMonth === new Date().getMonth();
  }).length;

  // Get count of birthdays per month for displaying in grid view
  const getBirthdayCountForMonth = (monthIndex) => {
    return birthdays.filter(birthday => {
      const birthdayMonth = new Date(birthday.date).getMonth();
      return birthdayMonth === monthIndex;
    }).length;
  };

  return (
    <div className="birthday-list">
      <div className="birthday-list-header">
        <h1>Birthday Calendar</h1>
        <div className="birthday-list-actions">
          <div className="birthday-count">
            <Gift className="icon" />
            <span>{currentMonthBirthdays} birthdays</span>
          </div>
          <button className="view-toggle-btn" onClick={toggleView}>
            <Calendar className="icon" />
            {showCalendarView ? "Grid View" : "Calendar View"}
          </button>
        </div>
      </div>

      {showCalendarView ? (
        <CalendarView 
          birthdays={birthdays}
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          onDayClick={handleDayClick}
          months={months}
        />
      ) : (
        <>
          <MonthGrid 
            onMonthClick={handleMonthClick} 
            months={months}
            getBirthdayCount={getBirthdayCountForMonth}
          />
        </>
      )}

      {selectedMonth && !selectedDay && (
        <MonthModal
          month={selectedMonth.monthName}
          birthdays={selectedMonth.birthdays}
          onClose={closeModal}
        />
      )}

      {selectedDay && (
        <MonthModal
          month={`${selectedDay.monthName} ${selectedDay.day}`}
          birthdays={selectedDay.birthdays}
          onClose={closeModal}
          isDay={true}
        />
      )}
    </div>
  );
}

export default BirthdayList;