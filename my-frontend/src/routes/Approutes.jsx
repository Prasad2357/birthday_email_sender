import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BirthdayList from '../components/BirthdayList';
import Sidebar from '../components/Sidebar';
import Settings from '../pages/Settings';
import AddBirthdayModal from '../components/AddBirthdayModal';

function AppRoutes() {
  const [birthdays, setBirthdays] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchBirthdays = () => {
    fetch("http://localhost:8000/birthdays/")
      .then((res) => res.json())
      .then((data) => setBirthdays(data))
      .catch((err) => console.error("Failed to fetch birthdays:", err));
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  return (
    <div className="app">
      <Sidebar birthdays={birthdays} onAddClick={() => { setSelectedDate(null); setIsAddModalOpen(true); }} />
      <div className="main">
        <Routes>
          <Route path="/" element={
            <BirthdayList 
              birthdays={birthdays} 
              setBirthdays={setBirthdays} 
              showCalendarView={true} 
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
              setSelectedDate={setSelectedDate}
              onAddSuccess={fetchBirthdays}
            />
          } />
          <Route path="/calendar" element={<Navigate to="/" replace />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      {isAddModalOpen && (
        <AddBirthdayModal
          selectedDate={selectedDate}
          onClose={() => setIsAddModalOpen(false)}
          onAddSuccess={fetchBirthdays}
        />
      )}
    </div>
  );
}

export default AppRoutes;
