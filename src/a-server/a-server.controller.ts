import { Controller, Get, UseGuards } from '@nestjs/common';
import { AServerService } from './a-server.service';
import { AServerApiPath } from './a-server-api-path';
import { AServerThrottlerGuard } from './guard/a-server-throttler.guard';

@Controller()
export class AServerController {
  constructor(private readonly aServerService: AServerService) {}

  /**
   * 외부에서 "/"를 호출할 수 있도록 API 노출
   *
   * Client의 id를 기준으로 초당 최대 10회 제약 조건이 있습니다.
   * 만약 한 id가 초당 10회를 초과하여 요청을 보낸다면 적절한 Error message를 보냅니다.
   */
  @UseGuards(AServerThrottlerGuard)
  @Get()
  async get(): Promise<boolean> {
    return await this.aServerService.get(AServerApiPath.ROOT);
  }

  /**
   * post, put, delete를 열어줘야 한다면 아래처럼 작성하면 됩니다.
   *
   * @UseGuards(AServerThrottlerGuard)
   * @Post()
   * async post(): Promise<boolean> {
   *   return await this.aServerService.post(AServerApiPath.ROOT);
   * }
   *
   * @UseGuards(AServerThrottlerGuard)
   * @Put()
   * async put(): Promise<boolean> {
   *   return await this.aServerService.put(AServerApiPath.ROOT);
   * }
   *
   * @UseGuards(AServerThrottlerGuard)
   * @Delete()
   * async delete(): Promise<boolean> {
   *   return await this.aServerService.delete(AServerApiPath.ROOT);
   * }
   */
}
