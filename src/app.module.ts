import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://abraam27:gVwRxwsSB5nZEWiL@nestjs.ecsj6yf.mongodb.net/',
      {
        dbName: 'multivision-demo',
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
