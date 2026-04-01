import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostType } from './enums/postType.enum';
import { PostStatus } from './enums/postStatus.enum';
import { User } from 'src/users/user.schema';
import { Tag } from 'src/tags/tag.schema';

@Schema({
  collection: 'posts',
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
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
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  author: User;

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }],
  })
  tags: Tag[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
