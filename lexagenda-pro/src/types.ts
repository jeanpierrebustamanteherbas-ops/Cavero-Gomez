export type Status = 'Programado' | 'En curso' | 'Realizado' | 'Reprogramado' | 'Suspendido';
export type Modality = 'Virtual' | 'Presencial';
export type TaskType = 'Audiencia' | 'Reunión' | 'Escrito' | 'Visita' | 'Otro';

export interface Expedient {
  id: string;
  number: string;
  client: string;
  description: string;
  status: 'Activo' | 'Cerrado' | 'En Archivo';
}

export interface Task {
  id: string;
  expedientId: string;
  client: string;
  type: TaskType;
  description: string;
  date: string; // ISO string YYYY-MM-DD
  startTime: string; // HH:mm
  modality: Modality;
  status: Status;
  link?: string;
  observations?: string;
  responsible?: string;
}

export interface AgendaState {
  tasks: Task[];
  expedients: Expedient[];
}
