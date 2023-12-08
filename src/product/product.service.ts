import { Injectable, Logger } from '@nestjs/common';
import { ProductKeywordDto } from './dto/product-keyword.dto';
import { CategoryService } from './category/category.service';
import { ProductDto } from './dto/product.dto';
import { CategoryDto } from './category/dto/category.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 코딩 테스트 - 1: 상품 카테고리 매칭
   *
   * 목표
   * 상품을 수집할 때
   *    "제공된 키워드를 기반"으로
   *    "카테고리 목록과 매칭"하여
   *    "상품에 카테고리 정보를 연결"
   * 하는 프로세스를 구현합니다.
   *
   * @returns 함수 실행 시간(ms)
   */
  challenge1(dto: ProductKeywordDto): number {
    const start = Date.now();
    /**
     * keyword 기반을 기반으로, 매칭되는 category 가져오기
     * 매칭되는 category가 없다면 Throw
     */
    const category = this.categoryService.findByNameOrThrow(dto.keyword);
    /**
     * 상품에 카테고리 정보를 연결
     */
    const productDto = new ProductDto(dto.name, CategoryDto.of(category));

    this.logger.log('변환된 product');
    this.logger.log(JSON.stringify(productDto));

    const end = Date.now();
    return end - start;
  }
}
