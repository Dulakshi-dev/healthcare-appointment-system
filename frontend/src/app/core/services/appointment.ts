// core/services/appointment.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl);
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  addAppointment(appt: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, appt);
  }

  updateAppointment(id: number, appt: any): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, appt);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAppointmentSummary(id: number): Observable<{ summary: string }> {
    return this.http.get<{ summary: string }>(`${this.baseUrl}/${id}/summary`);
  }
}
