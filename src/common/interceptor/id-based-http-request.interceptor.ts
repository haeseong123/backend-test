import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { ErrorMessage } from '../exception/error-message';
import { Observable } from 'rxjs';
import { SendRequestDto } from '../rapid-http/dto/send-request.dto';
import { LinkedQueue } from '../structure/que/linked/linked-queue';
import { Queue } from '../structure/que/queue';

@Injectable()
export class IdBasedHttpRequestInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const id = request.headers['id'] as string;

    /**
     * request.headers['id'] 값이 string이 아니면 예외 throw
     */
    if (!this.isString(id)) {
      throw new BadRequestException(ErrorMessage.HEADER_PARAM_IS_MISSING);
    }

    /**
     * id 값을 기준으로 queue를 생성합니다.
     *
     * 이미 queue가 존재한다면 생성하지 않습니다.
     */
    const queue = await this.cacheManager.get<Queue<SendRequestDto>>(id);
    if (!queue) {
      await this.cacheManager.set(id as string, new LinkedQueue(), 0);
    }

    /**
     * 다음 단계를 호출합니다.
     */
    return next.handle();
  }

  private isString(s: unknown): boolean {
    return (
      !!s && !Array.isArray(s) && (typeof s === 'string' || s instanceof String)
    );
  }
}
