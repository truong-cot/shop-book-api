import { ObjectId } from 'mongodb';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('_tb_publishing_house')
export class PublishingHouse extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;
}
