import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { MessageRepository } from '../../../repository/message.repository';
import { MessageDto } from './dto/message-dto';
import axios from 'axios';

interface GptAnswer {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  private logger: Logger = new Logger('ChatGateway');
  private gptUrl;
  private readonly apiKey;

  constructor(private messageRepository: MessageRepository) {
    this.gptUrl = 'https://api.openai.com/v1/chat/completions';
    this.apiKey = process.env.GPT_API;
  }

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  async generateResponse(): Promise<string> {
    const findMessages = await this.messageRepository.getAllMessages();
    const messages = findMessages.map((message) => ({
      role: message.type === 'bot' ? 'system' : message.type,
      content: message.text,
    }));

    const data = {
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 1,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const response = await axios.post<GptAnswer>(
      'https://api.openai.com/v1/chat/completions',
      data,
      {
        headers,
      },
    );

    return response.data.choices[0].message.content.trim();
  }

  @SubscribeMessage('chat')
  async handleMessage(client: any, message: MessageDto) {
    await this.messageRepository
      .save(message.type, message.text)
      .catch((err) => this.logger.error(err));
    this.server.emit('chat', message);

    const botMessage = await this.generateResponse();

    if (botMessage) {
      await this.messageRepository
        .save('bot', botMessage)
        .catch((err) => this.logger.error(err));
      this.server.emit('chat', botMessage);
    } else {
      this.server.emit('chat', 'Произошла ошибка, попробуйте ещё раз');
    }
  }
}
