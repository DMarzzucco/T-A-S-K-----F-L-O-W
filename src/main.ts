import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from "morgan"
import { CORS } from './constants';
import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'))
  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    }
  }))
  app.enableCors(CORS);
  app.setGlobalPrefix("api")
  // 
  // console.log (process.env.NODE_ENV)
  // const configureService = app.get(ConfigService)
  // console.log(configureService.get('ND'))
  // 
  const port = process.env.PORT || 3001


  await app.listen(port);
  console.log(`port listen in ${port}`)
}
bootstrap();
