import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly usersService: UsersService) { }
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

    createPost(createPostDto: CreatePostDto) {
        return {
            ...createPostDto,
            id: 1,
        };
    }
}
