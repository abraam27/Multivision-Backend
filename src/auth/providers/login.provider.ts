import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { LoginDto } from '../dtos/login.dto';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class LoginProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);
    let isPasswordValid: boolean = false;

    try {
      isPasswordValid = await this.hashingProvider.comparePassword(
        loginDto.password,
        user.password,
      );
    } catch (error) {
      console.log((error as Error).message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error comparing passwords',
        },
      );
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}
