import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { LoginProvider } from './login.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginProvider: LoginProvider,
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  async login(loginDto: LoginDto) {
    return await this.loginProvider.login(loginDto);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }

  isAuth() {
    return true;
  }
}
