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
import { JwtPaylod } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const user: JwtPaylod = req.user as JwtPaylod;

    const hasRole = requiredRole == user.role;

    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role');
    }

    return true;
  }
}
