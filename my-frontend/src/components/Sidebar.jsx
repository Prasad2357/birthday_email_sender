import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ birthdays = [], onAddClick }) {
  const location = useLocation();

  // Find next birthday for the countdown strip
  const getNextBirthday = () => {
    if (!birthdays || birthdays.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = birthdays.map(b => {
      const bdate = new Date(b.date);
      const bdayThisYear = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
      
      if (bdayThisYear < today) {
        bdayThisYear.setFullYear(today.getFullYear() + 1);
      }
      
      const diffTime = bdayThisYear - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return { ...b, nextBday: bdayThisYear, daysAway: diffDays };
    }).sort((a, b) => a.daysAway - b.daysAway);
    
    return upcoming[0];
  };

  const nextBday = getNextBirthday();

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getAvClass = (index) => {
    return `av${(index % 8) + 1}`;
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-mark">🎂</div>
        <div className="logo-name">Remin<em>day</em></div>
      </div>

      <div className="nav-group">
        <span className="nav-label">Main</span>
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'on' : ''}`}>
          <span className="ni">📅</span> Calendar
        </Link>
        <div className="nav-item">
          <span className="ni">⊞</span> All Months
        </div>
        <div className="nav-item">
          <span className="ni">🔔</span> Reminders
        </div>
      </div>

      <div className="nav-group">
        <span className="nav-label">Manage</span>
        <div className="nav-item" onClick={onAddClick}>
          <span className="ni">＋</span> Add Birthday
        </div>
        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'on' : ''}`}>
          <span className="ni">⚙</span> Settings
        </Link>
      </div>

      <div className="sidebar-bottom">
        {nextBday && (
          <div className="countdown-strip" style={{ marginBottom: '12px' }}>
            <div className="cs-label">🎉 Next birthday</div>
            <div className="cs-name">{nextBday.name}</div>
            <div className="cs-date">
              {new Date(nextBday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · turning {new Date(nextBday.nextBday).getFullYear() - new Date(nextBday.date).getFullYear()}
            </div>
            <div className="cs-days">{nextBday.daysAway} <span>days away</span></div>
          </div>
        )}

        <div className="upcoming-list">
          {birthdays.slice(0, 3).map((b, i) => {
              const bdate = new Date(b.date);
              const today = new Date();
              const bdayThisYear = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
              if (bdayThisYear < today) bdayThisYear.setFullYear(today.getFullYear() + 1);
              const daysAway = Math.ceil((bdayThisYear - today) / (1000 * 60 * 60 * 24));

              return (
                <div className="up-row" key={b.bday_id || i}>
                  <div className={`up-av ${getAvClass(i)}`}>{getInitials(b.name)}</div>
                  <div className="up-info">
                    <div className="up-name">{b.name}</div>
                    <div className="up-date">{bdate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div className="up-d">{daysAway}d</div>
                </div>
              );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
