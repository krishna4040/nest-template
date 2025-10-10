import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/core/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtPaylod } from 'src/interfaces/jwt-payload.interface';
import {
  acess_token_sign_options,
  refresh_token_sign_options,
} from 'src/constants/cookies';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload: JwtPaylod = { sub: user.id, role: user.role };

    const access_token = await this.jwtService.signAsync(
      payload,
      acess_token_sign_options,
    );

    const refesh_token = await this.jwtService.signAsync(
      payload,
      refresh_token_sign_options,
    );

    await this.usersService.update(user.id, { refresh_token: refesh_token });

    return {
      access_token,
      user,
      refesh_token,
    };
  }

  async register(registerDto: RegisterDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    registerDto.password = hashedPassword;
    const user = await this.usersService.create(registerDto);

    const payload: JwtPaylod = { sub: user.id, role: user.role };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.usersService.update(user.id, { refresh_token: refresh_token });

    return {
      user: { ...user, password: undefined },
      access_token,
      refresh_token,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (user.refresh_token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: JwtPaylod = { sub: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    return { access_token };
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refresh_token: null });
    return true;
  }
}
