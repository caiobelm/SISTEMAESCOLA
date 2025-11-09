import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('WEB_APP_URL') ?? 'http://localhost:3000',
    credentials: true
  });
  app.use(csurf({ cookie: true }));

  const config = new DocumentBuilder()
    .setTitle('API {{NOME_DA_ESCOLA}}')
    .setDescription('API para gestão escolar, biblioteca e presença')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT') ?? 3333;
  await app.listen(port);
  console.log(`API executando na porta ${port}`);
}

bootstrap();
