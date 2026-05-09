import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Mock active bookings
  const bookedDays = [10, 11, 12, 24, 25];

  return (
    <div className="glass dark:dark-glass p-6 rounded-3xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">Booking Calendar</h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"><ChevronLeft className="w-5 h-5"/></button>
          <span className="font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold text-slate-500 mb-4">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isBooked = bookedDays.includes(day);
          return (
            <div 
              key={day} 
              className={`h-10 flex items-center justify-center rounded-xl font-bold cursor-pointer transition-colors ${
                isBooked 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
