import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RapidHttpService } from './rapid-http.service';

@Module({
  imports: [HttpModule],
  providers: [RapidHttpService],
  exports: [RapidHttpService],
})
export class RapidHttpModule {}
