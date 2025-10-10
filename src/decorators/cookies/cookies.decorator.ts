import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Record } from '@prisma/client/runtime/library';
import type { Request } from 'express';

export const Cookie = createParamDecorator(
  (_: string, ctx: ExecutionContext): Record<string, any> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.cookies;
  },
);
