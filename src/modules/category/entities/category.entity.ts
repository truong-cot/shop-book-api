import { ObjectId } from 'mongodb';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('_tb_category')
export class Category extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  description: string;
}
