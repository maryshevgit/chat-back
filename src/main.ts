import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const url = process.env.CYCLIC_URL;

  await app.listen(url || 3000);
}
bootstrap();
