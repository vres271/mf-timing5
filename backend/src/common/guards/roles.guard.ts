import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;  // Если роли не указаны, доступ разрешён
    }

    const request = context.switchToHttp().getRequest();
    const rolesHeader = request.headers['x-roles'];  // Извлекаем роли из заголовка

    if (!rolesHeader) {
      return false;  // Если заголовок отсутствует, доступ запрещён
    }

    const userRoles = rolesHeader.split(',');  // Преобразуем строку ролей в массив

    return requiredRoles.some(role => userRoles.includes(role));
  }
}