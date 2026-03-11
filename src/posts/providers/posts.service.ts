import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../post.schema';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getPosts() {
    return await this.postModel
      .find()
      .populate('author')
      .populate('tags')
      .exec();
  }

  getPostsByUserId(userId: number) {
    const user = this.usersService.getUserById(userId);
    return [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        userId: user?.id,
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        userId: user?.id,
      },
    ];
  }

  async createPost(createPostDto: CreatePostDto) {
    const post = new this.postModel(createPostDto);
    return await post.save();
  }
}
