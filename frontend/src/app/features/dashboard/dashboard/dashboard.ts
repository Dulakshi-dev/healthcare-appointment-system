import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient';
import { AppointmentService } from '../../../core/services/appointment';
import { Patient } from '../../../core/models/patient.model';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  patients = signal<Patient[]>([]);
  appointments = signal<Appointment[]>([]);

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.patientService.getPatients().subscribe(data => this.patients.set(data));
    this.appointmentService.getAppointments().subscribe(data => this.appointments.set(data));
  }

  get totalPatients() {
    return this.patients().length;
  }

  get scheduledCount() {
    return this.appointments().filter((a: any) => a.status === 'Scheduled').length;
  }

  get todaysAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments().filter((a: any) => a.date === today);
  }

  get upcomingAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments()
      .filter((a: any) => a.date >= today && a.status === 'Scheduled')
      .sort((a: any, b: any) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }

  patientName(appt: any): string {
    const patientId = appt.patient?.id ?? appt.patientId;
    const p = this.patients().find(pt => pt.id === patientId);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  }
}