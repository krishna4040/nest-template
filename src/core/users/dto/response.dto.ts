import { User } from '@prisma/client';
import { Role } from 'src/constants/roles.enum';

export class UserResponse implements Omit<User, 'password'> {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
