import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsJSON,
  Matches,
  MaxLength,
  MinLength,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { MetaOptionsDto } from './meta-options.dto';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be a valid slug',
  })
  slug: string;

  @IsNotEmpty()
  @IsEnum(PostStatus)
  status: PostStatus;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsJSON()
  Schema?: string;

  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @IsOptional()
  @IsDate()
  publishedOn?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(20, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetaOptionsDto)
  metaOptions?: MetaOptionsDto[];
}
