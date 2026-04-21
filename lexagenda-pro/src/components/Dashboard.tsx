import React from 'react';
import { AgendaState, Task, Status } from '../types';
import { 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  TrendingUp, 
  CheckCircle2,
  Users,
  ChevronRight
} from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusColor, getStatusDot } from '../lib/agenda-utils';
import { cn } from '../lib/utils';

interface DashboardProps {
  state: AgendaState;
  onTaskUpdate: (id: string, status: Status) => void;
  onViewChange: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onTaskUpdate, onViewChange }) => {
  const todayTasks = state.tasks.filter(t => isToday(parseISO(t.date)));
  const tomorrowTasks = state.tasks.filter(t => isTomorrow(parseISO(t.date)));
  const urgentTasks = state.tasks.filter(t => t.status === 'Programado' && isToday(parseISO(t.date)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Resumen del Estudio</h2>
          <p className="text-slate-500 mt-1">Sigue el pulso de tus casos hoy, {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por expediente o cliente..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<AlertCircle className="text-rose-500" />} 
          label="Diligencias Hoy" 
          value={todayTasks.length.toString()} 
          color="border-rose-100"
        />
        <StatCard 
          icon={<CalendarIcon className="text-indigo-500" />} 
          label="Próximas Mañana" 
          value={tomorrowTasks.length.toString()} 
          color="border-indigo-100"
        />
        <StatCard 
          icon={<Users className="text-sky-500" />} 
          label="Clientes Activos" 
          value={state.expedients.length.toString()} 
          color="border-sky-100"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-500" />} 
          label="Completadas" 
          value={state.tasks.filter(t => t.status === 'Realizado').length.toString()} 
          color="border-emerald-100"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Focus */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-indigo-500" size={18} />
              Diligencias Prioritarias
            </h3>
            <button 
              onClick={() => onViewChange('agenda')}
              className="text-indigo-600 text-sm font-semibold flex items-center hover:underline"
            >
              Ver agenda completa <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {todayTasks.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {todayTasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-bold text-slate-800 tabular-nums">{task.startTime}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">HH:MM</p>
                      </div>
                      <div className="h-10 w-px bg-slate-200 self-center" />
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">{task.client}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                          <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(task.status))} />
                          {task.type} • {task.modality}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider", getStatusColor(task.status))}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 font-medium">
                No hay diligencias programadas para hoy.
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Alerts */}
        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-rose-500" size={18} />
            Alertas Urgentes
          </h3>
          <div className="space-y-3">
            {urgentTasks.length > 0 ? (
              urgentTasks.map(task => (
                <div key={task.id} className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Audiencia Urgente</p>
                    <time className="text-[11px] font-mono text-rose-500 font-bold">{task.startTime}</time>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-tight">{task.client}</h4>
                  <p className="text-xs text-rose-700 mt-1 line-clamp-1">{task.description}</p>
                </div>
              ))
            ) : (
              <div className="bg-emerald-50 border-emerald-100 border p-4 rounded-xl text-center">
                <p className="text-emerald-700 text-sm font-medium">No tienes alertas pendientes 🎉</p>
              </div>
            )}
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Dato del Mes</p>
            <h4 className="text-2xl font-serif font-bold italic mb-4">92% Eficacia</h4>
            <p className="text-xs text-white/80 leading-relaxed">Has completado casi todas tus audiencias programadas este mes. ¡Sigue así!</p>
          </div>
        </section>

      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className={cn("bg-white p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-md", color)}>
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
    <p className="text-3xl font-serif font-bold text-slate-900 tabular-nums">{value}</p>
  </div>
);
