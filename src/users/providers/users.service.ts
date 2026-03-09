import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * UsersService is a service that provides user-related functionality
 */
@Injectable()
export class UsersService {
  /**
   * Constructor
   * @param authService - The auth service
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  /**
   * Users
   * @type {Array<{id: number, name: string, email: string, password: string}>}
   */
  private users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password',
    },
  ];

  /**
   * Get all users
   * @param limit - The limit of users to return
   * @param page - The page number to return
   * @returns An array of users
   */
  getAllUsers(limit: number, page: number) {
    if (!this.authService.isAuth()) {
      throw new UnauthorizedException('Unauthorized');
    }
    console.log(limit, page);
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password',
      },
      {
        id: 3,
        name: 'Jim Doe',
        email: 'jim.doe@example.com',
        password: 'password',
      },
    ];
  }

  /**
   * Get a user by id
   * @param id - The id of the user to return
   * @returns The user
   */
  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return await user.save();
  }
}
