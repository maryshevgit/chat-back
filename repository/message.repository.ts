import { Repository } from 'typeorm';
import { MessageEntity } from '../libs/entities/src/message.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async save(type: 'user' | 'bot', text: string): Promise<MessageEntity> {
    const newMessage = this.messageRepository.create({
      type,
      text,
    });

    return this.messageRepository.save(newMessage);
  }

  async getAllMessages(): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      take: 10,
      order: { createdAt: 'DESC' },
    });
  }
}
