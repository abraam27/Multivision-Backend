import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        userId,
        ...payload,
      },
      {
        secret: this.configService.get('jwt.secret'),
        audience: this.configService.get('jwt.audience'),
        issuer: this.configService.get('jwt.issuer'),
        expiresIn,
      },
    );
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user._id.toString(),
        this.configService.get<number>('jwt.ttl') ?? 3600,
        {
          email: user.email,
        },
      ),
      this.signToken<Partial<ActiveUserData>>(
        user._id.toString(),
        this.configService.get<number>('jwt.refreshTtl') ?? 86400,
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
