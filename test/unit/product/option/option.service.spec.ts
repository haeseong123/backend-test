import { Test, TestingModule } from '@nestjs/testing';
import { TranslateWord } from 'src/entity/product/translate-word/translate.entity';
import { OptionDto } from 'src/product/option/dto/option.dto';
import { OptionService } from 'src/product/option/option.service';
import { TranslateWordService } from 'src/product/translate-word/translate-word.service';

describe('OptionService', () => {
  let optionService: OptionService;
  let translateWordService: TranslateWordService;

  beforeEach(async () => {
    const translateWordServiceMock = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionService,
        { provide: TranslateWordService, useValue: translateWordServiceMock },
      ],
    }).compile();

    optionService = module.get<OptionService>(OptionService);
    translateWordService =
      module.get<TranslateWordService>(TranslateWordService);
  });

  describe('challenge2 호출', () => {
    it('성공', async () => {
      // Given
      const dtos = [new OptionDto(1, '가구')];
      const translateWordList = [new TranslateWord('가구', '변환된 가구')];
      const translateSpy = jest.spyOn(translateWordService, 'findAll');

      translateSpy.mockReturnValue(translateWordList);

      // When
      optionService.challenge2(dtos);

      // Then
      expect(translateSpy).toHaveBeenCalled();
    });
  });
});
