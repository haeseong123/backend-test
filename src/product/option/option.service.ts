import { Injectable } from '@nestjs/common';
import { TranslateWordService } from '../translate-word/translate-word.service';
import { OptionDto } from './dto/option.dto';

@Injectable()
export class OptionService {
  constructor(private readonly translateWordService: TranslateWordService) {}

  /**
   * 코딩 테스트 - 2: 단어 치환
   *
   * 목표
   * 옵션 이름에 나타난 특정 단어들을 주어진 단어 치환 목록을 사용하여 변경합니다.
   *
   * @returns 함수 실행 시간
   */
  async challenge2(dtos: OptionDto[]): Promise<number> {
    console.log(dtos, '변환 전 dtos');

    /**
     * translateWordList 가져오기
     */
    const translateWordList = await this.translateWordService.findAll();
    const start = Date.now();

    /**
     * 1. dtos의 각 요소의 name 프로퍼티에 나타난 특정 단어들을 단어 치환 목록을 사용하여 변환하기
     * 2. 변환된 dtos를 로깅하기
     */

    const end = Date.now();
    const totalRunTime = end - start;

    console.log(dtos, '변환 후 dtos');
    console.log(translateWordList);
    console.log(totalRunTime);

    return totalRunTime;
  }
}
