import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class DeleteAuthorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'ID không được để trống!' })
  @IsObjectId({ message: 'ID không hợp lệ!' })
  _id: string;
}
