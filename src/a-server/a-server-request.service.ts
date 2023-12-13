import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { CronService } from 'src/common/cron/cron.service';
import { RapidHttpService } from 'src/common/rapid-http/rapid-http.service';
import { Cache } from 'cache-manager';
import { SendRequestDto } from 'src/common/rapid-http/dto/send-request.dto';
import { Queue } from 'src/common/structure/que/queue';

@Injectable()
export class AServerRequestService {
  private static readonly MAX_REQUEST_PER_SECOND: number = 10;

  private readonly promise: Promise<void>;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly rapidHttpService: RapidHttpService,
    cronService: CronService,
  ) {
    this.promise = Promise.resolve();

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
   * idQueues를 순회하며 id를 기준으로 최대 MAX_REQUEST_PER_SECOND 만큼의 요청을 보냅니다.
   *
   * 받은 요청을 id를 기준으로 순차적으로 보냅니다.
   */
  private handleRequestQueues() {
    this.promise.then(async () => {
      const keys = await this.cacheManager.store.keys();

      for (const key of keys) {
        const queue = await this.cacheManager.get<Queue<SendRequestDto>>(key);

        if (!queue) {
          continue;
        }

        for (
          let count = 0;
          count < AServerRequestService.MAX_REQUEST_PER_SECOND;
          count++
        ) {
          const sendRequestDto = queue.poll();
          if (!sendRequestDto) {
            break;
          }

          this.rapidHttpService.sendRequest(sendRequestDto);
        }
      }
    });
  }
}
