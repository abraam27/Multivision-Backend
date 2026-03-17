import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async refreshTokens(refreshToken: RefreshTokenDto) {
    try {
      const { userId } = await this.jwtService.verifyAsync<
        Partial<ActiveUserData>
      >(refreshToken.refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
        audience: this.configService.get<string>('jwt.audience'),
        issuer: this.configService.get<string>('jwt.issuer'),
      });
      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.usersService.getUserById(userId);
      return this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      console.log((error as Error).message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
