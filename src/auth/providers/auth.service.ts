import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { LoginProvider } from './login.provider';

@Injectable()
export class AuthService {
  constructor(private readonly loginProvider: LoginProvider) {}

  async login(loginDto: LoginDto) {
    return await this.loginProvider.login(loginDto);
  }

  isAuth() {
    return true;
  }
}
