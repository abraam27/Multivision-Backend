import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import type { QueryFilter } from 'mongoose';
import { Model } from 'mongoose';
import { Post } from '../post.schema';
import { Tag } from 'src/tags/tag.schema';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  async getPosts(getPostsDto: GetPostsDto): Promise<Paginated<Post>> {
    const { page, limit, startDate, endDate } = getPostsDto;
    const query: QueryFilter<Post> = {};
    if (startDate) {
      query.publishedOn = { $gte: startDate };
    }
    if (endDate) {
      query.publishedOn = { $lte: endDate };
    }
    const paginatedPosts = await this.paginationProvider.paginateQuery(
      this.postModel,
      { page, limit },
      query,
    );
    return paginatedPosts;
  }

  async getPostsByUserId(userId: string) {
    const user = await this.usersService.getUserById(userId);
    return [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        userId: user._id.toString(),
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        userId: user._id.toString(),
      },
    ];
  }

  async createPost(createPostDto: CreatePostDto, activeUser: ActiveUserData) {
    return await this.createPostProvider.createPost(createPostDto, activeUser);
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    let tags: Tag[] | null = null;
    let updatedPost: Post | null = null;
    let existingPost: Post | null = null;
    try {
      tags = await this.tagsService.findMultipleTags(updatePostDto.tags ?? []);
    } catch (error) {
      console.log(error.message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (tags !== null && tags.length !== (updatePostDto.tags?.length ?? 0)) {
      throw new BadRequestException(
        'Tags do not match the number of tags provided',
      );
    }

    try {
      existingPost = await this.postModel
        .findById(postId)
        .populate('tags')
        .exec();
    } catch (error) {
      console.log(error.message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    try {
      updatedPost = await this.postModel.findByIdAndUpdate(
        postId,
        updatePostDto,
        { new: true },
      );
    } catch (error) {
      console.log(error.message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!updatedPost) {
      throw new BadRequestException('Post not found');
    }

    return updatedPost;
  }
}
