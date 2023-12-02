import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { RapidResponse } from '../interceptor/rapid-response';
import { instanceToPlain } from 'class-transformer';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    const responseBody: RapidResponse<null> = {
      statusCode,
      message,
      result: null,
    };

    this.logger.error(`HTTP Error: ${statusCode} - Message: ${message}`);
    this.logger.error(exception);

    response.json(instanceToPlain(responseBody));
  }
}
