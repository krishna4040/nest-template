import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPaylod } from 'src/interfaces/jwt-payload.interface';
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    // Non cookie method
    // const [bearer, token] = authHeader.split(' ');
    // if (bearer !== 'Bearer' || !token) {
    //   throw new UnauthorizedException('Invalid token format');
    // }

    // Cookie method
    const token: string = request.cookies?.access_token as string;

    try {
      const payload: JwtPaylod = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else if (error instanceof NotBeforeError) {
        throw new ForbiddenException('Token not active yet');
      } else {
        console.error('JWT verification error:', error);
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
}
