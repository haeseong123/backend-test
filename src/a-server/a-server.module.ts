import { Module } from '@nestjs/common';
import { AServerController } from './a-server.controller';
import { AServerService } from './a-server.service';

@Module({
  controllers: [AServerController],
  providers: [AServerService],
  exports: [AServerService],
})
export class AServerModule {}
