import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>; // Роли, необходимые для доступа
    const userRoles = this.authService.getRoles();
    // Проверка, есть ли у пользователя хотя бы одна из необходимых ролей
    const hasRole = expectedRoles.some((role) => userRoles.includes(role));

    if (hasRole) {
      return true;
    } else {
      this.router.navigate(['/access-denied']); // Перенаправление на страницу "Доступ запрещен"
      return false;
    }
  }
}