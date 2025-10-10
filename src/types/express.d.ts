import type { JwtPayload } from 'src/interfaces/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      cookies?: Record<string, any>;
    }
  }
}
