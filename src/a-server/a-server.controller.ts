import { Controller, Get } from '@nestjs/common';
import { AServerService } from './a-server.service';
import { AServerApiPath } from './enum/a-server-api-path';
import { HeaderParam } from '../common/pipe/header-param';
import { AServerRequestDto } from './dto/a-server-request.dto';

@Controller()
export class AServerController {
  constructor(private readonly aServerService: AServerService) {}

  /**
   * 외부에서 "/"를 호출할 수 있도록 API 노출
   */
  @Get()
  get(@HeaderParam('id') id: string): boolean {
    const dto = new AServerRequestDto(AServerApiPath.ROOT, id);

    return this.aServerService.get(dto);
  }
}
