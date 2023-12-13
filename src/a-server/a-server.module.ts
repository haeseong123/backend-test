import { Module } from '@nestjs/common';
import { AServerService } from './a-server.service';
import { AServerController } from './a-server.controller';
import { CronModule } from 'src/common/cron/cron.module';
import { RapidHttpModule } from 'src/common/rapid-http/rapid-http.module';
import { AServerRequestService } from './a-server-request.service';

@Module({
  imports: [CronModule, RapidHttpModule],
  controllers: [AServerController],
  providers: [AServerService, AServerRequestService],
  exports: [AServerService, AServerRequestService],
})
export class AServerModule {}
