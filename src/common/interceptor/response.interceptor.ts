import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { Request } from 'express';
import { RapidResponse } from './rapid-response';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Record<string, any>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Record<string, any>> {
    return next.handle().pipe(
      map((result: T) => {
        const statusCode =
          context.switchToHttp().getResponse<Request>().statusCode || 200;
        const message = this.getMessageFromStatusCode(statusCode);
        const successResponse: RapidResponse<T> = {
          statusCode,
          message,
          result,
        };

        return instanceToPlain(successResponse);
      }),
    );
  }

  getMessageFromStatusCode(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.OK:
        return 'OK';
      case HttpStatus.CREATED:
        return 'CREATED';
      case HttpStatus.ACCEPTED:
        return 'ACCEPTED';
      case HttpStatus.NON_AUTHORITATIVE_INFORMATION:
        return 'NON_AUTHORITATIVE_INFORMATION';
      case HttpStatus.NO_CONTENT:
        return 'NO_CONTENT';
      case HttpStatus.RESET_CONTENT:
        return 'RESET_CONTENT';
      case HttpStatus.PARTIAL_CONTENT:
        return 'PARTIAL_CONTENT';
      default:
        return 'Unkown Status';
    }
  }
}
