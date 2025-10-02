import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterResponse, SigninResponse } from './dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({ status: 200, type: SigninResponse, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Invalid Credentials' })
  @ApiResponse({ status: 400, description: 'Invalid email or password format' })
  async signIn(@Body() signInDto: SigninDto): Promise<SigninResponse> {
    return await this.authService.signIn(signInDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: RegisterResponse, description: 'Success' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Invalid email or password format' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return await this.authService.register(registerDto);
  }
}
