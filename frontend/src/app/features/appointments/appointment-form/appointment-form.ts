
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment';
import { PatientService } from '../../../core/services/patient';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss',
})
export class AppointmentForm implements OnInit {
  isEditMode = false;
  appointmentId: number | null = null;
  patients: Patient[] = [];

  form: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {
    this.form = this.fb.group({
      patientId: [null as number | null, Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required],
      status: ['Scheduled', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe(
      data => (this.patients = data)
    );

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.appointmentId = Number(idParam);

      this.appointmentService
        .getAppointmentById(this.appointmentId)
        .subscribe((existing: any) => {
          this.form.patchValue({
            patientId: existing.patient?.id ?? existing.patientId,
            date: existing.date,
            time: existing.time,
            reason: existing.reason,
            status: existing.status,
            notes: existing.notes,
          });
        });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload = {
      patient: {
        id: raw.patientId
      },
      date: raw.date,
      time: raw.time,
      reason: raw.reason,
      status: raw.status,
      notes: raw.notes,
    };

    const request =
      this.isEditMode && this.appointmentId !== null
        ? this.appointmentService.updateAppointment(
            this.appointmentId,
            payload
          )
        : this.appointmentService.addAppointment(payload);

    request.subscribe(() => {
      this.router.navigate(['/appointments']);
    });
  }
}
