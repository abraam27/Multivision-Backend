import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Extract the Request object from the context
    const request: Request = context.switchToHttp().getRequest();

    // Extract the token from the request headers
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const secret = this.configService.get<string>('jwt.secret');
      const payload: { id: string, email: string } = await this.jwtService.verifyAsync(token, {
        secret,
      });
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      console.log((error as Error).message);
      throw new UnauthorizedException('Invalid token', {
        description: 'Error verifying token',
      });
    }
    return true;
  }
}
