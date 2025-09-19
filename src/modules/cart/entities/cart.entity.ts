import { ObjectId } from 'mongodb';
import { BaseEntity } from 'src/common/base.entity';
import { Entity, ObjectIdColumn } from 'typeorm';

@Entity('_tb_cart')
export class Cart extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;
}
