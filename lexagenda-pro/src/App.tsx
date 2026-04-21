import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { AgendaView } from './components/AgendaView';
import { FormView } from './components/FormView';
import { ExpedientsView } from './components/ExpedientsView';
import { Task, Expedient, AgendaState } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { isToday, parseISO, differenceInMinutes } from 'date-fns';
import { cn } from './lib/utils';

const INITIAL_EXPEDIENTS: Expedient[] = [
  { id: '1', number: 'EXP-2024-001', client: 'Juan Perez', description: 'Divorcio contencioso', status: 'Activo' },
  { id: '2', number: 'EXP-2024-002', client: 'Empresa Constructora S.A.', description: 'Incumplimiento de contrato', status: 'Activo' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    expedientId: '1',
    client: 'Juan Perez',
    type: 'Audiencia',
    description: 'Audiencia de conciliación',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    modality: 'Presencial',
    status: 'Programado',
    link: 'https://zoom.us/j/123456789'
  }
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'alert' }[]>([]);
  const [state, setState] = useState<AgendaState>(() => {
    const saved = localStorage.getItem('lex_agenda_data');
    if (saved) return JSON.parse(saved);
    return {
      tasks: INITIAL_TASKS,
      expedients: INITIAL_EXPEDIENTS
    };
  });

  useEffect(() => {
    localStorage.setItem('lex_agenda_data', JSON.stringify(state));
  }, [state]);

  // Check for upcoming tasks every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      state.tasks.forEach(task => {
        if (task.status === 'Programado' && isToday(parseISO(task.date))) {
          const [h, m] = task.startTime.split(':').map(Number);
          const taskTime = new Date();
          taskTime.setHours(h, m, 0);
          
          const diff = differenceInMinutes(taskTime, now);
          if (diff === 60 || diff === 15) {
            addToast(`Recordatorio: Diligencia con ${task.client} en ${diff} minutos`, 'alert');
          }
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [state.tasks]);

  const addToast = (message: string, type: 'success' | 'alert' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const addTask = (task: Task) => {
    setState(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    addToast('Diligencia guardada correctamente');
  };

  const updateTaskStatus = (taskId: string, status: any) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));
    addToast(`Estado actualizado a ${status}`);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard state={state} onTaskUpdate={updateTaskStatus} onViewChange={setView} />;
      case 'calendar': return <CalendarView state={state} onTaskUpdate={updateTaskStatus} />;
      case 'agenda': return <AgendaView state={state} onTaskUpdate={updateTaskStatus} />;
      case 'form': return <FormView state={state} onAdd={addTask} onComplete={() => setView('dashboard')} />;
      case 'expedients': return <ExpedientsView state={state} />;
      default: return <Dashboard state={state} onTaskUpdate={updateTaskStatus} onViewChange={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation currentView={view} onViewChange={setView} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast System */}
      <div className="fixed bottom-6 right-6 z-[60] space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] pointer-events-auto border",
                toast.type === 'success' ? "bg-white border-emerald-100" : "bg-rose-50 border-rose-200"
              )}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
              ) : (
                <AlertCircle className="text-rose-500" size={20} />
              )}
              <p className={cn("text-xs font-bold", toast.type === 'success' ? "text-slate-800" : "text-rose-700")}>
                {toast.message}
              </p>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-auto p-1 hover:bg-slate-100 rounded text-slate-400"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
