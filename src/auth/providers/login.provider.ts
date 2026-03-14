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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider,

        @Inject(forwardRef(() => JwtService))
        private readonly jwtService: JwtService,

        @Inject(forwardRef(() => ConfigService))
        private readonly configService: ConfigService,

    ) { }

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

        const accessToken = await this.jwtService.signAsync({
            id: user._id,
            email: user.email,
        }, {
            secret: this.configService.get('jwt.secret'),
            audience: this.configService.get('jwt.audience'),
            issuer: this.configService.get('jwt.issuer'),
            expiresIn: this.configService.get('jwt.ttl'),
        });

        return {
            access_token: accessToken,
        };
    }
}
