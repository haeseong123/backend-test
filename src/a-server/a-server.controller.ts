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
  proxy() {
    return this.aServerService.proxy(AServerApiPath.ROOT);
  }
}
