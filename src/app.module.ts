import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsModule } from './tags/tags.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import profileConfig from './config/profile.config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import environmentValidation from './config/enviroment.validation';

const ENV = process.env.NODE_ENV ?? 'develop';
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? 'env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, profileConfig],
      validationSchema: environmentValidation,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.mongoDB.mongoUri'),
        dbName: configService.get('database.mongoDB.mongoDbName'),
      }),
      inject: [ConfigService],
    }),
    TagsModule,
    PaginationModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AccessTokenGuard, 
  }],
})
export class AppModule {}
