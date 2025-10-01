import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'src/constants/roles.enum';
import { ROLES_KEY } from 'src/decorators/roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user }: Request = context.switchToHttp().getRequest();

    if (!user || !user?.roles) return false;

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role');
    }

    return true;
  }
}
