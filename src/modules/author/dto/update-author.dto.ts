import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty({ message: 'ID không được để trống!' })
  @IsObjectId({ message: 'ID không hợp lệ!' })
  _id: string;
}
