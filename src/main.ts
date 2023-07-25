import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
const logger = new Logger('App');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const url = process.env.CYCLIC_URL;
  logger.log(url);

  await app.listen(url || 3000);
}
bootstrap();
