import { Role } from 'src/constants/roles.enum';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

interface User extends JwtPayload {
  roles: Role[];
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
