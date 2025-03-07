import { provideRouter, Routes, withDebugTracing } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { LoginComponent } from './features/login/components/login/login.component';
import { AdminComponent } from './features/admin/components/admin/admin.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AccessDeniedComponent } from './features/access-denied/components/access-denied/access-denied.component';
import { ApplicationConfig } from '@angular/core';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    {
      path: 'admin',
      component: AdminComponent,
      canActivate: [AuthGuard, RoleGuard], // Применение Guards
      data: { roles: ['admin'] }, // Роли, необходимые для доступа
    },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: '**', redirectTo: '' }, // Перенаправление на главную страницу
  ];
  
// export const appConfig: ApplicationConfig = {
//     providers: [provideRouter(routes, withDebugTracing())]
// }
