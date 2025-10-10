import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Role } from 'src/constants/roles.enum';

export class UserResponse implements Omit<User, 'password' | 'refresh_token'> {
  @ApiResponseProperty({
    type: String,
    example: '1234',
  })
  id: string;

  @ApiResponseProperty({ example: 'John', type: String })
  firstName: string;

  @ApiResponseProperty({ example: 'Doe', type: String })
  lastName: string;

  @ApiResponseProperty({ example: 'alice@example.com', type: String })
  email: string;

  @ApiResponseProperty({ example: Role.Admin })
  role: Role;
}
