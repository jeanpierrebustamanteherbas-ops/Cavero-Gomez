import React from 'react';
import { AgendaState, Expedient } from '../types';
import { FileText, Plus, Gavel, Users, ChevronRight, Hash, Scale } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExpedientsViewProps {
  state: AgendaState;
}

export const ExpedientsView: React.FC<ExpedientsViewProps> = ({ state }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Gestión de Expedientes</h2>
          <p className="text-slate-500 mt-1">Administra la base de datos de tus casos y procesos legales.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 transition-all text-sm font-bold active:scale-95">
          <Plus size={18} />
          Nuevo Expediente
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {state.expedients.length > 0 ? (
          state.expedients.map(exp => {
            const expTasks = state.tasks.filter(t => t.expedientId === exp.id);
            return (
              <div key={exp.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors shrink-0">
                    <Scale size={32} />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1 uppercase tracking-wider">
                         <Hash size={10} /> {exp.number}
                       </span>
                       <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                          exp.status === 'Activo' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                       )}>
                         {exp.status}
                       </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{exp.client}</h3>
                    <p className="text-slate-500 text-sm font-medium">{exp.description}</p>
                  </div>

                  <div className="h-px md:h-12 w-full md:w-px bg-slate-100" />

                  <div className="flex gap-8 md:min-w-[200px]">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800">{expTasks.length}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Diligencias</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800">
                        {expTasks.filter(t => t.status === 'Realizado').length}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Completadas</p>
                    </div>
                    <button className="self-center p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-2 text-sm font-bold">
                       Detalles
                       <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-3xl">
             <FileText className="mx-auto text-slate-200 mb-4" size={48} />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay expedientes registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};
