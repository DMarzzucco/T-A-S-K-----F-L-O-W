import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from "morgan"
import { CORS } from './constants';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './utils/error.manager';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'))
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    }
  }))

  app.useGlobalFilters(new GlobalExceptionFilter())

  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  app.enableCors(CORS);
  app.setGlobalPrefix("api")

  const config = new DocumentBuilder()
    .setTitle('T A S K / / F L O W')
    .setDescription('Task management application designed to optimize collaboration and access control between users.')
    .addCookieAuth("optional-session-id")
    .setVersion("1.0")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001


  await app.listen(port);
  console.log(`port listen in ${port}`)
}
bootstrap();
