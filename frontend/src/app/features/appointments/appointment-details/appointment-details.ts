import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment';
import { PatientService } from '../../../core/services/patient';
import { Appointment } from '../../../core/models/appointment.model';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.scss',
})
export class AppointmentDetails implements OnInit {
  appointment = signal<Appointment | undefined>(undefined);
  patient = signal<Patient | undefined>(undefined);
  summary = signal('');
  loadingSummary = signal(false);
  summaryError = signal('');

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.appointmentService.getAppointmentById(id).subscribe((data: any) => {
      this.appointment.set(data);
      const patientId = data.patient?.id ?? data.patientId;
      this.patientService.getPatientById(patientId).subscribe(p => this.patient.set(p));
    });
  }

  generateSummary() {
    const appt = this.appointment();
    if (!appt) return;
    this.loadingSummary.set(true);
    this.summaryError.set('');
    this.appointmentService.getAppointmentSummary(appt.id).subscribe({
      next: res => {
        this.summary.set(res.summary);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.summaryError.set('Failed to generate summary. Please try again.');
        this.loadingSummary.set(false);
      },
    });
  }
}