import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AServerRequestDto } from './dto/a-server-request.dto';
import { LinkedQueue } from 'src/common/structure/que/linked/linked-queue';
import { Queue } from 'src/common/structure/que/queue';
import { CronService } from 'src/common/cron/cron.service';
import { CronExpression } from '@nestjs/schedule';
import { RapidHttpService } from 'src/common/rapid-http/rapid-http.service';
import { SendRequestDto } from 'src/common/rapid-http/dto/send-request.dto';
import { ErrorMessage } from 'src/common/exception/error-message';
import { HttpMethod } from 'src/common/rapid-http/type/http-method';

@Injectable()
export class AServerService {
  private static readonly HOME_URL = 'https://rapidup.co.kr';
  private static readonly MAX_REQUEST_PER_SECOND: number = 10;

  private readonly idQueues: Map<string, Queue<SendRequestDto>>;

  constructor(
    cronService: CronService,
    private readonly rapidHttpService: RapidHttpService,
  ) {
    this.idQueues = new Map<string, Queue<SendRequestDto>>();

    /**
     * https://docs.nestjs.com/techniques/task-scheduling
     *
     * handleRequestQueues 함수가 1초마다 수행되도록 cronJob을 추가합니다.
     */
    cronService.addCronJob(
      'handleRequestQueues',
      CronExpression.EVERY_SECOND,
      () => {
        this.handleRequestQueues();
      },
    );
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
    const sendRequestDto = new SendRequestDto(
      this.getUri(dto.path),
      method,
      () => {
        this.throwInternalServerExceptionWithId(dto.id);
      },
    );
    const queue = this.getOrCreateQueue(dto.id);
    queue.offer(sendRequestDto);

    return true;
  }

  /**
   * ID를 key로 사용하여 idQueues에 있는 특정 queue를 가져옵니다.
   *
   * ID에 해당되는 queue가 없다면 map.set()으로 새 queue를 추가한 후 해당 queue를 반환합니다.
   */
  private getOrCreateQueue(id: string): Queue<SendRequestDto> {
    return (
      this.idQueues.get(id) || this.idQueues.set(id, new LinkedQueue()).get(id)!
    );
  }

  /**
   * HOME_URL의 뒷부분에 path를 더한 uri를 반환합니다.
   */
  private getUri(path: string): string {
    return AServerService.HOME_URL + path;
  }

  /**
   * id가 포함된 ErrorMessage와 함께 InternalServerException을 던집니다.
   */
  private throwInternalServerExceptionWithId(id: string): never {
    throw new InternalServerErrorException(
      `[${id}] ${ErrorMessage.REQUEST_TO_ANOTHER_SERVER_FAILS}`,
    );
  }

  /**
   * idQueues를 순회하며 id를 기준으로 최대 MAX_REQUEST_PER_SECOND 만큼의 요청을 보냅니다.
   *
   * 받은 요청을 id를 기준으로 순차적으로 보냅니다.
   */
  private handleRequestQueues() {
    for (const [_id, queue] of this.idQueues.entries()) {
      for (
        let count = 0;
        count < AServerService.MAX_REQUEST_PER_SECOND;
        count++
      ) {
        const sendRequestDto = queue.poll();
        if (!sendRequestDto) {
          break;
        }

        this.rapidHttpService.sendRequest(sendRequestDto);
      }
    }
  }
}
