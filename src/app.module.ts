import { Module } from '@nestjs/common';
import { ProvidersModule } from '../libs/providers/src';
import { ChatGateway } from './websockets/chat/chat.gateway';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [ProvidersModule, RepositoryModule],
  providers: [ChatGateway],
})
export class AppModule {}
