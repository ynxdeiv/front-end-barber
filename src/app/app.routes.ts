import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';
import { PaymentsPageComponent } from './pages/payments-page/payments-page.component';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { MyAppointmentsPageComponent } from './pages/my-appointments-page/my-appointments-page.component';
import { adminGuard } from './guards/admin.guard';
import { schedulerGuard } from './guards/scheduler.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'admin',
    component: AdminDashboardPageComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'appointment',
    component: AppointmentPageComponent,
    canActivate: [schedulerGuard]
  },
  {
    path: 'my-appointments',
    component: MyAppointmentsPageComponent,
    canActivate: [schedulerGuard]
  },
  {
    path: 'payments',
    component: PaymentsPageComponent,
    canActivate: [adminGuard]
  }
];
