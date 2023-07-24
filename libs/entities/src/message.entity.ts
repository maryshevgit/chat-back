import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('messages')
export class MessageEntity {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  text: string;

  @Column()
  type: 'user' | 'bot';

  @Column({ name: 'created_at' })
  createdAt: Date = new Date();

  @Column({ name: 'updated_at' })
  updatedAt: Date = new Date();
}
