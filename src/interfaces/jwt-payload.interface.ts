import { Role } from 'src/constants/roles.enum';

export interface JwtPaylod {
  sub: string;
  role: Role;
}
