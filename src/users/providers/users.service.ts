import {
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
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
    private readonly configService: ConfigService,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
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
    console.log(limit, page);
    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_IMPLEMENTED,
        error: 'Not implemented',
        fileName: 'users.service.ts',
        lineNumber: 63,
      },
      HttpStatus.NOT_IMPLEMENTED,
      {
        description: 'Not implemented',
        cause: new Error(),
      },
    );
  }

  /**
   * Get a user by id
   * @param id - The id of the user to return
   * @returns The user
   */
  async getUserById(id: string): Promise<User> {
    let user: User | null = null;
    try {
      user = await this.userModel.findById(id);
    } catch (error) {
      console.log(error.message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.createUser(createUserDto);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }
}
