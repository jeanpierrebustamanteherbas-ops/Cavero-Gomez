import React, { useState } from 'react';
import { AgendaState, Task, Status, Modality, TaskType } from '../types';
import { 
  Save, 
  MapPin, 
  Video, 
  ChevronDown, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Clock, 
  User,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FormViewProps {
  state: AgendaState;
  onAdd: (task: Task) => void;
  onComplete: () => void;
}

export const FormView: React.FC<FormViewProps> = ({ state, onAdd, onComplete }) => {
  const [formData, setFormData] = useState({
    expedientId: '',
    type: 'Audiencia' as TaskType,
    client: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    modality: 'Presencial' as Modality,
    link: '',
    observations: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.client) nextErrors.client = 'El cliente es obligatorio';
    if (!formData.startTime) nextErrors.startTime = 'La hora es obligatoria';
    if (!formData.date) nextErrors.date = 'La fecha es obligatoria';
    if (!formData.description) nextErrors.description = 'La descripción es obligatoria';
    
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newTask: Task = {
      ...formData,
      id: Math.random().toString(36).substring(2, 9),
      status: 'Programado'
    };

    onAdd(newTask);
    onComplete();
  };

  const handleExpedientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const expId = e.target.value;
    const exp = state.expedients.find(ex => ex.id === expId);
    setFormData(prev => ({
      ...prev,
      expedientId: expId,
      client: exp ? exp.client : ''
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Nueva Diligencia</h2>
        <p className="text-slate-500 mt-1">Registra rápidamente una nueva actividad en tu agenda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                Expediente Relacionado
              </label>
              <div className="relative group">
                <select 
                  value={formData.expedientId}
                  onChange={handleExpedientChange}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                >
                  <option value="">-- Sin expediente (Manual) --</option>
                  {state.expedients.map(exp => (
                    <option key={exp.id} value={exp.id}>{exp.number} - {exp.client}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <User size={12} />
                Cliente / Caso*
              </label>
              <input 
                type="text" 
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                placeholder="Nombre del cliente o caso"
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium",
                  errors.client ? "border-rose-300 ring-2 ring-rose-500/10" : "border-slate-200"
                )}
              />
              {errors.client && <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1 italic"><AlertCircle size={10} /> {errors.client}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              Tipo de Diligencia
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Audiencia', 'Reunión', 'Escrito', 'Visita', 'Otro'] as TaskType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all uppercase tracking-widest shadow-sm",
                    formData.type === type 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100" 
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-500"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              Descripción*
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Ej: Audiencia de pruebas y tachas ante el 3er Juzgado Civil..."
              rows={3}
              className={cn(
                "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium resize-none",
                errors.description ? "border-rose-300 ring-2 ring-rose-500/10" : "border-slate-200"
              )}
            />
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CalendarIcon size={12} />
                Fecha*
              </label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} />
                Hora Inicio*
              </label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700",
                  errors.startTime ? "border-rose-300 ring-2 ring-rose-500/10" : "border-slate-200"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                Modalidad
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, modality: 'Presencial' }))}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all uppercase tracking-widest shadow-sm",
                    formData.modality === 'Presencial'
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-500"
                  )}
                >
                  <MapPin size={16} /> Presencial
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, modality: 'Virtual' }))}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all uppercase tracking-widest shadow-sm",
                    formData.modality === 'Virtual'
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-500"
                  )}
                >
                  <Video size={16} /> Virtual
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                Vínculo (Ej: Zoom / Meet)
              </label>
              <input 
                type="url" 
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Save size={20} />
            GUARDAR DILIGENCIA
          </button>
          <button 
            type="button"
            onClick={onComplete}
            className="px-8 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-2xl transition-all font-bold uppercase text-xs tracking-widest"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
