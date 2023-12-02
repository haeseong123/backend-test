import { Module } from '@nestjs/common';
import { TranslateWordService } from './translate-word.service';

@Module({
  providers: [TranslateWordService],
  exports: [TranslateWordService],
})
export class TranslateModule {}
