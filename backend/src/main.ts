import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { QueryFailedFilter } from 'src/common/filters/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем глобальную валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, которые не описаны в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние поля
      transform: true, // Преобразует данные в соответствии с типами DTO
      disableErrorMessages: false, // Показывает сообщения об ошибках
    }),
  );

  app.useGlobalFilters(new QueryFailedFilter()); // Подключаем глобальный фильтр

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
