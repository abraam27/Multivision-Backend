import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) { }
    private readonly users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', password: 'password' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password' },
    ];

    login(loginDto: LoginDto) {
        const user = this.users.find(user => user.email === loginDto.email && user.password === loginDto.password);
        return user;
    }

    isAuth() {
        return true;
    }
}
