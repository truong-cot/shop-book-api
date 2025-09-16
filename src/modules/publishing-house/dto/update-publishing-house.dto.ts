import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePublishingHouseDto } from './create-publishing-house.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class UpdatePublishingHouseDto extends PartialType(
  CreatePublishingHouseDto,
) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'ID không được để trống!' })
  @IsObjectId({ message: 'ID không hợp lệ!' })
  _id: string;
}
