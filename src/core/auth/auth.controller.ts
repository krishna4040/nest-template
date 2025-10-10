import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterResponse, SigninResponse } from './dto/response.dto';
import type { Response } from 'express';
import { Cookie } from 'src/decorators/cookies/cookies.decorator';
import { cookie_options } from 'src/constants/cookies';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CurrentUser } from 'src/decorators/current-user/current-user.decorator';
import type { JwtPaylod } from 'src/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({ status: 200, type: SigninResponse, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Invalid Credentials' })
  @ApiResponse({ status: 400, description: 'Invalid email or password format' })
  async signIn(
    @Body() signInDto: SigninDto,
    @Res() res: Response,
  ): Promise<SigninResponse> {
    const { access_token, user } = await this.authService.signIn(signInDto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return user;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: RegisterResponse, description: 'Success' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Invalid email or password format' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ): Promise<RegisterResponse> {
    const { user, refresh_token, access_token } =
      await this.authService.register(registerDto);

    res.cookie('refresh_token', refresh_token, cookie_options);
    res.cookie('access_token', access_token, cookie_options);

    return user;
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  async refreshToken(
    @Cookie() cookie: Record<string, any>,
    @CurrentUser() payload: JwtPaylod,
    @Res() res: Response,
  ) {
    const refreshToken = cookie?.refresh_token as string;
    const { access_token } = await this.authService.refreshToken(
      payload.sub,
      refreshToken,
    );
    res.cookie('access_token', access_token, cookie_options);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@CurrentUser() payload: JwtPaylod, @Res() res: Response) {
    await this.authService.logout(payload.sub);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
