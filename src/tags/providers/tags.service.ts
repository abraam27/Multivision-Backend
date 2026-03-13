import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../tag.schema';
@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}
  async createTag(createTagDto: CreateTagDto) {
    const tag = new this.tagModel(createTagDto);
    return await tag.save();
  }

  async findMultipleTags(tags: string[]) {
    try {
      const foundTags = await this.tagModel
        .find({ name: { $in: tags } })
        .exec();
      return foundTags;
    } catch (error) {
      console.log(error.message);
      throw new RequestTimeoutException(
        'Unable to process request at the moment, please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }
}
