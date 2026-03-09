import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class MetaOptionsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  key: string;

  @IsNotEmpty()
  value: any;
}
