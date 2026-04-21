import { format, startOfDay, isToday, isTomorrow, parseISO, compareAsc, addDays } from 'date-fns';
import { Task, Expedient, Status } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Re-extending jsPDF because autotable adds it to the prototype
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const generateAgendaPDF = (tasks: Task[], date: Date) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const formattedDate = format(date, 'dd/MM/yyyy');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Agenda Diaria - LexAgenda Pro', 14, 22);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Fecha: ${formattedDate}`, 14, 30);

  const tableData = tasks
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map(task => [
      task.startTime,
      task.client,
      task.type,
      task.status,
      task.modality,
      task.link || 'N/A'
    ]);

  doc.autoTable({
    startY: 40,
    head: [['Hora', 'Cliente/Expediente', 'Tipo', 'Estado', 'Modalidad', 'Enlace']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillStyle: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 9 }
  });

  doc.save(`agenda_${format(date, 'yyyy-MM-dd')}.pdf`);
};

export const getStatusColor = (status: Status) => {
  switch (status) {
    case 'Realizado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Suspendido': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Reprogramado': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'En curso': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const getStatusDot = (status: Status) => {
  switch (status) {
    case 'Realizado': return 'bg-emerald-500';
    case 'Suspendido': return 'bg-rose-500';
    case 'Reprogramado': return 'bg-amber-500';
    case 'En curso': return 'bg-blue-500';
    default: return 'bg-slate-400';
  }
};
