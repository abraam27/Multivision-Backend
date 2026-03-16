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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be a valid slug',
  })
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  Schema?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedOn?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetaOptionsDto)
  metaOptions?: MetaOptionsDto[];
}
