import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { PatientList } from './features/patients/patient-list/patient-list';
import { PatientDetails } from './features/patients/patient-details/patient-details';
import { PatientForm } from './features/patients/patient-form/patient-form';
import { AppointmentList } from './features/appointments/appointment-list/appointment-list';
import { AppointmentForm } from './features/appointments/appointment-form/appointment-form';
import { authGuard } from './core/guards/auth.guard';
import { AppointmentDetails } from './features/appointments/appointment-details/appointment-details';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'patients', component: PatientList, canActivate: [authGuard] },
  { path: 'patients/new', component: PatientForm, canActivate: [authGuard] },
  { path: 'patients/:id', component: PatientDetails, canActivate: [authGuard] },
  { path: 'patients/:id/edit', component: PatientForm, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentList, canActivate: [authGuard] },
  { path: 'appointments/new', component: AppointmentForm, canActivate: [authGuard] },
  { path: 'appointments/:id/edit', component: AppointmentForm, canActivate: [authGuard] },
  { path: 'appointments/:id', component: AppointmentDetails, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];