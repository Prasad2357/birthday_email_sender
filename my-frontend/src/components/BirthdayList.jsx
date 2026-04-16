import { useState } from "react";
import MonthGrid from "./MonthGrid";
import MonthModal from "./MonthModal";
import CalendarView from "./CalendarView";

function BirthdayList({ birthdays, setBirthdays, showCalendarView: initialView = true, isAddModalOpen, setIsAddModalOpen, setSelectedDate, onAddSuccess }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showCalendarView, setShowCalendarView] = useState(initialView);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

  const handleAddClick = (isoDate) => {
    setSelectedDate(isoDate);
    setIsAddModalOpen(true);
  };

  const handleBirthdayClick = (dayBirthdays, day, monthIndex) => {
    setSelectedDay({
      day,
      monthName: months[monthIndex],
      birthdays: dayBirthdays,
    });
  };

  const closeModal = () => {
    setSelectedMonth(null);
    setSelectedDay(null);
  };

  const totalBirthdays = birthdays.length;
  const currentMonthBirthdaysCount = birthdays.filter(b => new Date(b.date).getMonth() === new Date().getMonth()).length;
  
  const getDaysToNext = () => {
    if (birthdays.length === 0) return 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    const sorted = birthdays.map(b => {
      const bdate = new Date(b.date);
      const bdayThisYear = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
      if (bdayThisYear < today) bdayThisYear.setFullYear(today.getFullYear() + 1);
      return bdayThisYear - today;
    }).sort((a, b) => a - b);
    return Math.ceil(sorted[0] / (1000 * 60 * 60 * 24));
  };

  const getBirthdaysThisQuarter = () => {
    const currentQuarter = Math.floor(new Date().getMonth() / 3);
    return birthdays.filter(b => Math.floor(new Date(b.date).getMonth() / 3) === currentQuarter).length;
  };

  const getUpcomingBirthdays = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return birthdays.map(b => {
      const bdate = new Date(b.date);
      let bdayThisYear = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
      if (bdayThisYear < today) bdayThisYear.setFullYear(today.getFullYear() + 1);
      const daysAway = Math.ceil((bdayThisYear - today) / (1000 * 60 * 60 * 24));
      return { ...b, daysAway, turning: bdayThisYear.getFullYear() - bdate.getFullYear() };
    }).sort((a,b) => a.daysAway - b.daysAway).slice(0, 4);
  };

  const upcoming = getUpcomingBirthdays();
  const next = upcoming[0];

  const getAvClass = (index) => `av${(index % 8) + 1}`;
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <>
      <div className="topbar">
        <div className="tb-left">
          <h1>Birthday Calendar <span style={{ fontSize: '18px' }}>🎈</span></h1>
          <p>{months[currentMonth]} {currentYear} · {currentMonthBirthdaysCount} birthdays this month</p>
        </div>
        <div className="tb-right">
          <div className="vtoggle">
            <button className={`vt ${showCalendarView ? 'on' : ''}`} onClick={() => setShowCalendarView(true)}>Calendar</button>
            <button className={`vt ${!showCalendarView ? 'on' : ''}`} onClick={() => setShowCalendarView(false)}>Grid</button>
          </div>
          <div className="chip chip-ghost"><span>🎂</span> <span>{totalBirthdays} birthdays</span></div>
          <div className="chip chip-add" onClick={() => { setSelectedDate(null); setIsAddModalOpen(true); }}><span>＋</span> Add</div>
        </div>
      </div>

      <div className="content">
        <div className="stats">
          <div className="scard"><div className="scard-em">🎂</div><div className="scard-n">{totalBirthdays}</div><div className="scard-l">Total birthdays</div></div>
          <div className="scard"><div className="scard-em">⚡</div><div className="scard-n">{getDaysToNext()}</div><div className="scard-l">Days to next</div></div>
          <div className="scard"><div className="scard-em">📅</div><div className="scard-n">{currentMonthBirthdaysCount}</div><div className="scard-l">This month</div></div>
          <div className="scard"><div className="scard-em">🌟</div><div className="scard-n">{getBirthdaysThisQuarter()}</div><div className="scard-l">This quarter</div></div>
        </div>

        {showCalendarView ? (
          <div className="mg">
            <CalendarView
              birthdays={birthdays}
              currentMonth={currentMonth}
              currentYear={currentYear}
              setCurrentMonth={setCurrentMonth}
              setCurrentYear={setCurrentYear}
              onAddClick={handleAddClick}
              onBirthdayClick={handleBirthdayClick}
              months={months}
            />
            <div className="rp">
              {next && (
                <div className="hero-card">
                  <div className="hc-tag">🎉 Up next</div>
                  <div className="hc-name">{next.name}</div>
                  <div className="hc-sub">{new Date(next.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · turning {next.turning}</div>
                  <div className="hc-count">
                    <div className="hc-box"><div className="hc-num">{next.daysAway}</div><div className="hc-unit">days</div></div>
                    <div className="hc-box"><div className="hc-num">0</div><div className="hc-unit">hours</div></div>
                    <div className="hc-box"><div className="hc-num">00</div><div className="hc-unit">mins</div></div>
                  </div>
                </div>
              )}

              <div>
                <div className="sec-head">
                  <div className="sec-title">Upcoming Birthdays</div>
                  <div className="sec-more">See all →</div>
                </div>
                <div className="blist">
                  {upcoming.map((b, i) => (
                    <div key={b.bday_id} className="brow" onClick={() => handleBirthdayClick([b], new Date(b.date).getDate(), new Date(b.date).getMonth())}>
                      <div className={`bav ${getAvClass(i)}`}>{getInitials(b.name)}</div>
                      <div className="bi">
                        <div className="bn">{b.name}</div>
                        <div className="bd">{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · turning {b.turning}</div>
                      </div>
                      <div className={`badge ${b.daysAway < 7 ? 'bs' : b.daysAway < 30 ? 'bw' : 'bm'}`}>{b.daysAway}d</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MonthGrid
            onMonthClick={handleMonthClick}
            months={months}
            getBirthdayCount={(m) => birthdays.filter(b => new Date(b.date).getMonth() === m).length}
          />
        )}
      </div>

      {selectedMonth && !selectedDay && (
        <MonthModal
          month={selectedMonth.monthName}
          birthdays={selectedMonth.birthdays}
          onClose={closeModal}
          onBirthdayDeleted={onAddSuccess}
        />
      )}

      {selectedDay && (
        <MonthModal
          month={`${selectedDay.monthName} ${selectedDay.day}`}
          birthdays={selectedDay.birthdays}
          onClose={closeModal}
          isDay={true}
          onBirthdayDeleted={onAddSuccess}
        />
      )}
    </>
  );
}

export default BirthdayList;