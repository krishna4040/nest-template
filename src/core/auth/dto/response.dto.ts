import { UserResponse } from 'src/core/users/dto/response.dto';

export class SigninResponse {
  access_token: string;
}

export class RegisterResponse extends UserResponse {}
