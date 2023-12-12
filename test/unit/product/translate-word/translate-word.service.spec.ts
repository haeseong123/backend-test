import { Test, TestingModule } from '@nestjs/testing';
import { TranslateWord } from 'src/entity/product/translate-word/translate.entity';
import { TranslateWordService } from 'src/product/translate-word/translate-word.service';

describe('TranslateWordService', () => {
  let translateWordService: TranslateWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslateWordService],
    }).compile();

    translateWordService =
      module.get<TranslateWordService>(TranslateWordService);
  });

  describe('findAll 호출', () => {
    it('성공', () => {
      // Given
      const translateWordList: TranslateWord[] = [
        { src: '블랙', dest: '검정색' },
        { src: '레드', dest: '빨간색' },
      ];
      [...new Array(10000)].forEach((_, index) => {
        translateWordList.push({ src: index.toString(), dest: `A` });
      });

      // When
      const result = translateWordService.findAll();

      // Then
      expect(result).toStrictEqual(translateWordList);
    });
  });
});
