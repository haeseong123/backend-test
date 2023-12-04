import { Module } from '@nestjs/common';
import { AServerService } from './a-server.service';
import { HttpModule } from '@nestjs/axios';
import { AServerController } from './a-server.controller';

@Module({
  imports: [HttpModule],
  controllers: [AServerController],
  providers: [AServerService],
  exports: [AServerService],
})
export class AServerModule {}
