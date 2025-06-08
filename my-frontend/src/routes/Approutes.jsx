import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BirthdayList from '../components/BirthdayList';
import Navbar from '../components/Navbar';
import UserForm from '../components/AddBirthdayForm';
import Home from '../pages/Home' // <-- Add this

function AppRoutes() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Updated */}
          <Route path="/calendar" element={<BirthdayList showCalendarView={true} />} />
          <Route path="/userform" element={<UserForm />} />
          <Route path="/settings" element={<div>Settings page coming soon...</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default AppRoutes;
