import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment';
import { PatientService } from '../../../core/services/patient';
import { Appointment } from '../../../core/models/appointment.model';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})
export class AppointmentList implements OnInit {
  allAppointments = signal<Appointment[]>([]);
  patients = signal<Patient[]>([]);
  statusFilter = '';

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadPatients();
    this.loadAppointments();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe(data => this.patients.set(data));
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(data => this.allAppointments.set(data));
  }

  patientName(appt: any): string {
    const patientId = appt.patient?.id ?? appt.patientId;
    const p = this.patients().find(pt => pt.id === patientId);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  }

  get filteredAppointments() {
    if (!this.statusFilter) return this.allAppointments();
    return this.allAppointments().filter(a => a.status === this.statusFilter);
  }

  deleteAppointment(id: number) {
    if (confirm('Delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe(() => this.loadAppointments());
    }
  }
}