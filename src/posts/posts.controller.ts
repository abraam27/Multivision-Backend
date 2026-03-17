import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Query() getPostsDto: GetPostsDto) {
    return this.postsService.getPosts(getPostsDto);
  }

  @Get(':userId')
  getPostsByUserId(@Param('userId') userId: string) {
    return this.postsService.getPostsByUserId(userId);
  }

  @Post()
  @Auth(AuthType.Bearer)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.postsService.createPost(createPostDto, activeUser);
  }
}
