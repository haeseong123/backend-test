import { Injectable } from '@nestjs/common';
import { TranslateWord } from 'src/entity/product/translate-word/translate.entity';

@Injectable()
export class TranslateWordService {
  constructor() {}

  /**
   * 실사용 시 repository를 사용하여
   * DB에 있는 translateWord를 전부 가져오는 방식으로 동작
   *
   * @returns translateWordList
   */
  findAll(): TranslateWord[] {
    const translateWordList: TranslateWord[] = [
      { src: '블랙', dest: '검정색' },
      { src: '레드', dest: '빨간색' },
    ];
    [...new Array(10000)].forEach((_, index) => {
      translateWordList.push({ src: index.toString(), dest: `A` });
    });

    return translateWordList;
  }
}
