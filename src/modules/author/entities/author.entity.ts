import { ObjectId } from 'mongodb';
import { BaseEntity } from 'src/common/base.entity';
import { GENDER } from 'src/configs/enum';
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';

@Entity('_tb_author')
export class Author extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  gender: GENDER;

  @Column()
  birthday: Date;

  @Column()
  description: string;
}
