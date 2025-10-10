import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { JwtPaylod } from 'src/interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtPaylod => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as JwtPaylod;
  },
);
