import { Injectable, Logger } from '@nestjs/common';
import { TranslateWordService } from '../translate-word/translate-word.service';
import { OptionDto } from './dto/option.dto';
import { UpdatedOptionDto } from './dto/updated-option.dto';

@Injectable()
export class OptionService {
  private readonly logger = new Logger(OptionService.name);
  constructor(private readonly translateWordService: TranslateWordService) {}

  /**
   * 코딩 테스트 - 2: 단어 치환
   *
   * <목표>
   *    옵션 이름에 나타난
   *      "특정 단어"들을
   *      주어진 "단어 치환 목록"을 사용하여
   *    변경합니다.
   *
   * @returns 함수 실행 시간(ms)
   */
  challenge2(dtos: OptionDto[]): number {
    const start = Date.now();
    /**
     * translateWordList 가져오기
     */
    const translateWordList = this.translateWordService.findAll();
    const updatedOptionList: UpdatedOptionDto[] = [];

    for (const dto of dtos) {
      let updatedName = dto.name;
      for (const translateWord of translateWordList) {
        updatedName = updatedName.replaceAll(
          translateWord.src,
          translateWord.dest,
        );
      }

      updatedOptionList.push(new UpdatedOptionDto(dto.id, updatedName));
    }

    this.logger.log('변환된 optionList');
    this.logger.log(JSON.stringify(updatedOptionList));

    const end = Date.now();
    return end - start;
  }
}
