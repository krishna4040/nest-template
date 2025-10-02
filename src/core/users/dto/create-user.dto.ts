import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/constants/roles.enum';
import {
  Capitalize,
  ToLower,
} from 'src/decorators/transformers/transformer.decorator';

export class CreateUserDto implements Omit<User, 'id'> {
  @IsString()
  @IsNotEmpty()
  @Capitalize()
  @ApiProperty({ example: 'John', description: 'firstname' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Capitalize()
  @ApiProperty({ example: 'Doe', description: 'lastname' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ToLower()
  @ApiProperty({ example: 'alice@example.com', description: 'Email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one special character',
  })
  @ApiProperty({ example: 'P@ssw0rd!', description: 'Password' })
  password: string;

  @IsEnum(Role)
  @ApiProperty({ example: Role.Admin, description: 'Role' })
  role: Role;
}
