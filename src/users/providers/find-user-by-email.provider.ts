import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FindUserByEmailProvider {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUserByEmail(email: string): Promise<User> {
    let user: User | null = null;
    try {
      user = await this.userModel.findOne({ email });
    } catch (error) {
      console.log((error as Error).message);
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
}
