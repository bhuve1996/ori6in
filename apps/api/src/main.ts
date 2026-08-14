import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { loadConfig } from '@ori6in/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = loadConfig();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: config.WEB_URL, credentials: true });
  app.setGlobalPrefix('api');
  await app.listen(config.PORT, '0.0.0.0');
  console.log(`ORI6IN API listening on http://0.0.0.0:${config.PORT}/api`);
  console.log(`DATABASE_DRIVER=${config.DATABASE_DRIVER}`);
}

bootstrap();
