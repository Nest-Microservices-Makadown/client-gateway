import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main Gateway');
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );  
  
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.PORT);
  
  logger.log(`Gateway ready on port ${envs.PORT}`);
  logger.log('Microservices available are:')
  logger.log(`Products on ${envs.PRODUCTS_MS_HOST} port ${envs.PRODUCTS_MS_PORT}`);
}
bootstrap();
