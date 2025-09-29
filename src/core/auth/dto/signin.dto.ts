import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ToLower } from 'src/decorators/transformers/transformer.decorator';

export class SigninDto {
  @IsEmail()
  @ToLower()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
