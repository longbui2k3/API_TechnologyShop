import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import morgan from 'morgan';
import { AllExceptionsFilter } from './all-exceptions.filter';

const PORT: number | string = process.env.PORT || 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.use(morgan('dev'));
  app.use(helmet());

  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

bootstrap();
