import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../post.schema';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Tag } from 'src/tags/tag.schema';
import { TagsService } from 'src/tags/providers/tags.service';
import { User } from 'src/users/user.schema';

@Injectable()
export class CreatePostProvider {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    activeUser: ActiveUserData,
  ): Promise<Post> {
    let tags: Tag[] | null = null;
    let author: User | null = null;
    try {
      author = await this.usersService.getUserById(activeUser.userId);
      tags = await this.tagsService.findMultipleTags(createPostDto.tags ?? []);
    } catch (error) {
      console.log((error as Error).message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (tags !== null && tags.length !== (createPostDto.tags?.length ?? 0)) {
      throw new BadRequestException(
        'Tags do not match the number of tags provided',
      );
    }
    try {
      const post = new this.postModel({
        ...createPostDto,
        author,
        publishedOn: new Date(),
      });
      return await post.save();
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
