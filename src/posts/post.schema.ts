import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PostType } from './enums/postType.enum';
import { PostStatus } from './enums/postStatus.enum';

@Schema({ collection: 'posts' })
export class Post extends Document {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
    enum: PostType,
  })
  postType: PostType;

  @Prop({
    required: true,
    type: String,
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  postStatus: PostStatus;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  slug: string;

  @Prop({
    required: false,
    type: String,
  })
  content: string;

  @Prop({
    required: false,
    type: String,
  })
  featuredImageUrl: string;

  @Prop({
    required: false,
    type: String,
  })
  publishedOn: Date;

  @Prop({
    required: false,
    type: [String],
  })
  tags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
