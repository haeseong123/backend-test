import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AServerApiPath } from './a-server-api-path';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ErrorMessage } from 'src/common/exception/error-message';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AServerRequestDto } from './dto/a-server-request.dto';
import { LinkedQueue } from 'src/common/structure/que/linked/linked-queue';
import { Queue } from 'src/common/structure/que/queue';

type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

interface AServerPathWithMethod {
  path: AServerApiPath;
  method: HttpMethod;
}

@Injectable()
export class AServerService {
  private static readonly MAX_REQUEST_PER_SECOND: number = 10;

  private readonly idQueues: Map<string, Queue<AServerPathWithMethod>>;

  constructor(private readonly httpService: HttpService) {
    this.idQueues = new Map<string, Queue<AServerPathWithMethod>>();
  }

  /**
   * CRUD
   */
  post(dto: AServerRequestDto): boolean {
    return this.addToQueue(dto, 'POST');
  }

  get(dto: AServerRequestDto): boolean {
    return this.addToQueue(dto, 'GET');
  }

  put(dto: AServerRequestDto): boolean {
    return this.addToQueue(dto, 'PUT');
  }

  delete(dto: AServerRequestDto): boolean {
    return this.addToQueue(dto, 'DELETE');
  }

  /**
   * ID별로 큐에 요청 추가
   */
  private addToQueue(dto: AServerRequestDto, method: HttpMethod): boolean {
    const queue = this.getOrCreateQueue(dto.id);
    queue.offer({ path: dto.path, method });

    return true;
  }

  /**
   * id를 key로 사용하여 idQueues에 있는 특정 요소를 가져옵니다.
   *
   * id에 해당되는 요소가 없다면 map.set()으로 새 요소를 추가한 후 해당 요소를 반환합니다.
   */
  private getOrCreateQueue(id: string): Queue<AServerPathWithMethod> {
    return (
      this.idQueues.get(id) || this.idQueues.set(id, new LinkedQueue()).get(id)!
    );
  }

  /**
   * https://docs.nestjs.com/techniques/task-scheduling
   *
   * 1초마다 수행되는 handleCron 함수입니다.
   *
   * idQueues를 순회하며 id를 기준으로 최대 10개의 요청만 보냅니다.
   *
   * 받은 요청을 id를 기준으로 순차적으로 보냅니다.
   */
  @Cron(CronExpression.EVERY_SECOND)
  private handleCron() {
    for (const [id, queue] of this.idQueues.entries()) {
      for (
        let count = 0;
        count < AServerService.MAX_REQUEST_PER_SECOND;
        count++
      ) {
        const pathWithMethod = queue.poll();

        if (!pathWithMethod) {
          break;
        }

        this.sendRequest(id, pathWithMethod);
      }
    }
  }

  /**
   * http 요청을 보냅니다.
   */
  private sendRequest<T>(
    id: string,
    { path, method }: AServerPathWithMethod,
  ): Promise<AxiosResponse<T, any>> {
    const uri = this.getUri(path);
    const axiosMethod = this.getAxiosMethod(method);

    return axiosMethod<T>(uri).catch(() => {
      throw new InternalServerErrorException(
        `[${id}] ${ErrorMessage.REQUEST_TO_ANOTHER_SERVER_FAILS}`,
      );
    });
  }

  /**
   * http method에 맞는 axios 함수를 반환합니다.
   */
  private getAxiosMethod(method: HttpMethod) {
    switch (method) {
      case 'POST':
        return this.httpService.axiosRef.post;
      case 'GET':
        return this.httpService.axiosRef.get;
      case 'PUT':
        return this.httpService.axiosRef.put;
      case 'DELETE':
        return this.httpService.axiosRef.delete;
      default:
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
    }
  }

  private getUri(path: string): string {
    return 'https://rapidup.co.kr' + path;
  }
}
