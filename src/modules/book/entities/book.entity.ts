import { BaseEntity } from 'src/common/base.entity';
import { TYPE_BOOK } from 'src/configs/enum';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('_tb_book')
export class Book extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  thumbnail: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'date' })
  publishedDate: Date;

  @Column({ type: 'int' })
  pageCount: number;

  @Column({ type: 'int' })
  weight: number;

  @Column({ type: 'int' })
  length: number;

  @Column()
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'enum' })
  type: TYPE_BOOK;

  @Column({ type: 'string' })
  category_id: ObjectId;

  @Column({ type: 'string' })
  author_id: ObjectId;

  @Column({ type: 'string' })
  publishing_house_id: ObjectId;
}
