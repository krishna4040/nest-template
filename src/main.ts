import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
// import { doubleCsrf } from 'csrf-csrf';
// import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const { doubleCsrfProtection } = doubleCsrf(doubleCsrfOptions);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.set('query parser', 'extended');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // app.use(cookieParser());
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
