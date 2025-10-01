import { $Enums, User } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/constants/roles.enum';
import {
  Capitalize,
  ToLower,
} from 'src/decorators/transformers/transformer.decorator';

export class CreateUserDto implements Omit<User, 'id'> {
  @IsString()
  @IsNotEmpty()
  @Capitalize()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Capitalize()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ToLower()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;
}
