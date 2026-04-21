import React, { useState } from 'react';
import { AgendaState, Task, Status } from '../types';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Scale } from 'lucide-react';
import { cn } from '../lib/utils';
import { getStatusDot } from '../lib/agenda-utils';

interface CalendarViewProps {
  state: AgendaState;
  onTaskUpdate: (id: string, status: Status) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ state }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getTasksForDay = (day: Date) => {
    return state.tasks.filter(task => isSameDay(parseISO(task.date), day));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Calendario Jurídico</h2>
          <p className="text-slate-500 mt-1 capitalize">{format(currentMonth, "MMMM yyyy", { locale: es })}</p>
        </div>
        <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <button onClick={prevMonth} className="p-2.5 hover:bg-slate-50 text-slate-600 border-r border-slate-200 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest"
          >
            Hoy
          </button>
          <button onClick={nextMonth} className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-200">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-200">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
            <div key={d} className="py-4 text-center text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 min-h-[600px]">
          {days.map((day, idx) => {
            const dayTasks = getTasksForDay(day);
            const isSelectedMonth = isSameMonth(day, monthStart);
            const isTodayDate = isSameDay(day, new Date());

            return (
              <div 
                key={day.toISOString()} 
                className={cn(
                  "p-2 border-slate-100 border-r border-b min-h-[100px] transition-colors",
                  !isSelectedMonth ? "bg-slate-50/30 font-slate-300 opacity-50" : "bg-white",
                  idx % 7 === 6 ? "border-r-0" : ""
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all",
                    isTodayDate ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-600"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && isSelectedMonth && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                      {dayTasks.length} {dayTasks.length === 1 ? 'evento' : 'eventos'}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="text-[10px] p-1.5 rounded-lg border bg-white shadow-sm border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group truncate"
                      title={`${task.startTime} - ${task.client}: ${task.description}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                         <div className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(task.status))} />
                         <span className="font-bold text-slate-800 group-hover:text-indigo-600">{task.startTime}</span>
                      </div>
                      <p className="text-slate-500 font-medium truncate">{task.client}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
