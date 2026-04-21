import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  FileText, 
  ListTodo,
  Settings,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'dashboard', label: 'Tablero', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'agenda', label: 'Agenda del Día', icon: ListTodo },
    { id: 'expedients', label: 'Expedientes', icon: FileText },
    { id: 'form', label: 'Nueva Diligencia', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3 border-bottom mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <Scale size={24} />
        </div>
        <div>
          <h1 className="font-serif font-bold text-xl leading-tight">LexAgenda</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Pro Studio v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              currentView === item.id
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            )}
          >
            <item.icon 
              size={20} 
              className={cn(
                "transition-colors", 
                currentView === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"
              )} 
            />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <button className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">
          <Settings size={20} />
          Configuración
        </button>
      </div>
    </aside>
  );
};
