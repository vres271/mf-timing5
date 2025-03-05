import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

// Интерфейс для описания структуры ошибки PostgreSQL
interface PgError extends Error {
  code: string; // Код ошибки (например, '23505')
  detail?: string; // Дополнительное сообщение об ошибке
}

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Приводим driverError к типу PgError
    const driverError = exception.driverError as PgError;

    if (driverError.code === '23505') {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: driverError.detail || 'Unique constraint violation',
        error: 'Conflict',
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error',
      });
    }
  }
}