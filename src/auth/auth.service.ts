import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, AuthResponseDto, RefreshTokenDto } from './dto';
import { JWT_EXPIRATION, JWT_SECRET, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } from './constants';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email with password
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: JWT_EXPIRATION,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    try {
      const payload: JwtPayload = this.jwtService.verify(
        refreshTokenDto.refresh_token,
        { secret: JWT_REFRESH_SECRET },
      );

      const user = await this.usersService.findByIdWithPassword(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user.id, user.email);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: JWT_EXPIRATION,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRATION,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_EXPIRATION,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
