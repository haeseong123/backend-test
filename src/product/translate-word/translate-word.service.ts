import { Injectable } from '@nestjs/common';
import { TranslateWord } from 'src/entity/product/translate-word/translate.entity';

@Injectable()
export class TranslateWordService {
  constructor() {}

  /**
   * @returns translateWordList
   */
  async findAll(): Promise<TranslateWord[]> {
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
