import { Controller, Get } from '@nestjs/common';
import { OptionDto } from './dto/option.dto';
import { OptionService } from './option.service';

@Controller()
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  /**
   * 외부에서 "/challenge2"를 호출할 수 있도록 API 노출
   */
  @Get('challenge2')
  challenge2(): number {
    const dtos: OptionDto[] = [
      { id: 1, name: '블랙 XL' },
      { id: 2, name: '블랙 L' },
      { id: 3, name: '블랙 M' },
      { id: 4, name: '레드 XL' },
      { id: 5, name: '레드 L' },
      { id: 6, name: '레드 M' },
    ];
    [...new Array(50)].forEach((_, index) => {
      dtos.push({ id: index + 7, name: `블랙${index + 7}` });
    });

    return this.optionService.challenge2(dtos);
  }
}
