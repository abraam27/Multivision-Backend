import { Injectable } from '@nestjs/common';
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
}
