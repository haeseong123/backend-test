import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AServerRequestDto } from './dto/a-server-request.dto';
import { Queue } from 'src/common/structure/que/queue';
import { SendRequestDto } from 'src/common/rapid-http/dto/send-request.dto';
import { ErrorMessage } from 'src/common/exception/error-message';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpMethod } from 'src/common/rapid-http/type/http-method';

@Injectable()
export class AServerService {
  private static readonly HOME_URL = 'https://rapidup.co.kr';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * CRUD
   */
  async post(dto: AServerRequestDto): Promise<boolean> {
    return await this.addToQueue(dto, 'GET');
  }

  async get(dto: AServerRequestDto): Promise<boolean> {
    return await this.addToQueue(dto, 'GET');
  }

  async put(dto: AServerRequestDto): Promise<boolean> {
    return await this.addToQueue(dto, 'PUT');
  }

  async delete(dto: AServerRequestDto): Promise<boolean> {
    return await this.addToQueue(dto, 'DELETE');
  }

  /**
   * ID별로 큐에 요청 추가
   */
  private async addToQueue(
    dto: AServerRequestDto,
    method: HttpMethod,
  ): Promise<boolean> {
    const queue = await this.getQueueByIdOrThrow(dto.id);
    const requestDto = new SendRequestDto(this.getUri(dto.path), method, () => {
      throw new InternalServerErrorException(
        `[${dto.id}] ${ErrorMessage.REQUEST_TO_ANOTHER_SERVER_FAILS}`,
      );
    });

    return queue.offer(requestDto);
  }

  /**
   * id를 key로 사용하여 cache에 저장되어 있는 queue 가져오기
   *
   * queue가 없다면 trow exception
   */
  private async getQueueByIdOrThrow(
    id: string,
  ): Promise<Queue<SendRequestDto>> {
    const queue = await this.cacheManager.get<Queue<SendRequestDto>>(id);
    if (!queue) {
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return queue;
  }

  /**
   * HOME_URL의 뒷부분에 path를 더한 uri를 반환합니다.
   */
  private getUri(path: string): string {
    return AServerService.HOME_URL + path;
  }
}
