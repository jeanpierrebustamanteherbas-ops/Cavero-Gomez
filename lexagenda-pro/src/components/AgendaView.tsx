import React, { useState } from 'react';
import { AgendaState, Task, Status } from '../types';
import { format, isSameDay, parseISO, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, FileDown, Clock, MapPin, Video, MoreVertical, Edit3, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { getStatusColor, getStatusDot, generateAgendaPDF } from '../lib/agenda-utils';

interface AgendaViewProps {
  state: AgendaState;
  onTaskUpdate: (id: string, status: Status) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({ state, onTaskUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tasksForDay = state.tasks
    .filter(t => isSameDay(parseISO(t.date), selectedDate))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const changeDate = (amount: number) => {
    setSelectedDate(prev => addDays(prev, amount));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Agenda del Día</h2>
          <p className="text-slate-500 mt-1 capitalize">
            {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <button onClick={() => changeDate(-1)} className="p-2.5 hover:bg-slate-50 text-slate-600 border-r border-slate-200 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest"
            >
              Hoy
            </button>
            <button onClick={() => changeDate(1)} className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-200">
              <ChevronRight size={20} />
            </button>
          </div>
          <button 
            onClick={() => generateAgendaPDF(tasksForDay, selectedDate)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 transition-all text-sm font-bold active:scale-95"
          >
            <FileDown size={18} />
            Generar PDF
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasksForDay.length > 0 ? (
          tasksForDay.map(task => (
            <div 
              key={task.id} 
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-1 pt-6 pb-6 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Time & Indicator */}
                <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center md:min-w-[120px] gap-2">
                   <div className="flex items-center gap-2">
                     <Clock className="text-slate-400 group-hover:text-indigo-500 transition-colors" size={20} />
                     <span className="text-2xl font-bold text-slate-900 tabular-nums">{task.startTime}</span>
                   </div>
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest block w-fit",
                     getStatusColor(task.status)
                   )}>
                     {task.status}
                   </span>
                </div>

                <div className="h-px md:h-12 w-full md:w-px bg-slate-100 md:self-center" />

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.client}</h4>
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">
                          {task.type}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={task.status}
                        onChange={(e) => onTaskUpdate(task.id, e.target.value as Status)}
                        className="text-xs bg-slate-50 border-slate-200 rounded-lg px-2 py-1 outline-none font-bold text-slate-600 hover:border-indigo-300 transition-colors"
                      >
                        <option value="Programado">Programado</option>
                        <option value="En curso">En curso</option>
                        <option value="Realizado">Realizado</option>
                        <option value="Reprogramado">Reprogramado</option>
                        <option value="Suspendido">Suspendido</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      {task.modality === 'Presencial' ? <MapPin size={14} /> : <Video size={14} />}
                      <span className="uppercase tracking-wide">{task.modality}</span>
                    </div>
                    {task.link && (
                      <a 
                        href={task.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                      >
                        <ExternalLink size={14} />
                        ACCEDER AL VÍNCULO
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Sin actividades para hoy</h3>
            <p className="text-slate-500 max-w-xs mx-auto font-medium">Relájate o aprovecha para avanzar en tus escritos. No hay nada programado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
