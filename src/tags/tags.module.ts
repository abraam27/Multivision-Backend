import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './providers/tags.service';
import { Tag, TagSchema } from './tag.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  exports: [TagsService],
})
export class TagsModule {}
