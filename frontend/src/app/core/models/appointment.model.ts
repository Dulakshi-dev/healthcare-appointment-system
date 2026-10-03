export interface Appointment {
  id: number;
  patientId: number;
  date: string;
  time: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
}