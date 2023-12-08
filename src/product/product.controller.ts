import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductKeywordDto } from './dto/product-keyword.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 외부에서 "/challenge1"을 호출할 수 있도록 API 노출
   */
  @Get('challenge1')
  challenge1(): number {
    const dto: ProductKeywordDto = {
      keyword: '가구',
      name: '예제 상품명',
    };

    return this.productService.challenge1(dto);
  }
}
