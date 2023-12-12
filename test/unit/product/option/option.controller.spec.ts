import { Test, TestingModule } from '@nestjs/testing';
import { OptionController } from 'src/product/option/option.controller';
import { OptionService } from 'src/product/option/option.service';

describe('OptionController', () => {
  let optionController: OptionController;
  let optionService: OptionService;

  beforeEach(async () => {
    const optionServiceMock = {
      challenge2: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionController],
      providers: [{ provide: OptionService, useValue: optionServiceMock }],
    }).compile();

    optionController = module.get<OptionController>(OptionController);
    optionService = module.get<OptionService>(OptionService);
  });

  describe('challenge2 호출', () => {
    it('성공', async () => {
      // Given
      const expectValue = 1;

      jest.spyOn(optionService, 'challenge2').mockReturnValue(expectValue);

      // When
      const result = optionController.challenge2();

      // Then
      expect(result).toBe(expectValue);
    });
  });
});
