import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
})
export class PatientList implements OnInit {
  allPatients = signal<Patient[]>([]);
  searchTerm = '';

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe(data => this.allPatients.set(data));
  }

  get filteredPatients() {
    const term = this.searchTerm.toLowerCase();
    return this.allPatients().filter(
      p => p.firstName.toLowerCase().includes(term) || p.lastName.toLowerCase().includes(term)
    );
  }

  deletePatient(id: number) {
    if (confirm('Delete this patient?')) {
      this.patientService.deletePatient(id).subscribe(() => this.loadPatients());
    }
  }
}