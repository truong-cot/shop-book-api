import { ObjectId } from 'mongodb';
import { BaseEntity } from 'src/common/base.entity';
import { GENDER } from 'src/configs/enum';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('_tb_user')
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column()
  gender: GENDER;

  @Column()
  username: string;

  @Column()
  password: string;
}
