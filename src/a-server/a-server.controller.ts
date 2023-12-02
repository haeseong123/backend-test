import { Controller, Get } from '@nestjs/common';
import { AServerService } from './a-server.service';
import { AServerApiPath } from './a-server-api-path';

@Controller()
export class AServerController {
  constructor(private readonly aServerService: AServerService) {}

  /**
   * 외부에서 "/"를 호출할 수 있도록 API 노출
   *
   * 프록시 처리
   */
  @Get()
  proxy() {
    return this.aServerService.proxy(AServerApiPath.ROOT);
  }
}
