import {
  BadRequestException,
  Inject,
  forwardRef,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let existingUser: User | null = null;
    try {
      existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
    } catch (error) {
      console.log((error as Error).message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    try {
      const user = new this.userModel({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      return await user.save();
    } catch (error) {
      console.log((error as Error).message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }
}
