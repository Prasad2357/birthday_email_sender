import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BirthdayList from '../components/BirthdayList';
import Navbar from '../components/Navbar';
import Settings from '../pages/Settings';

function AppRoutes() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<BirthdayList showCalendarView={true} />} />
          <Route path="/calendar" element={<Navigate to="/" replace />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppRoutes;
