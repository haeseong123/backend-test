import { Injectable } from '@nestjs/common';
import { Category } from 'src/entity/product/category/category.entity';
import { ProductKeywordDto } from './dto/product-keyword.dto';
import { CategoryService } from './category/category.service';

@Injectable()
export class ProductService {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 코딩 테스트 - 1: 상품 카테고리 매칭
   *
   * 목표
   * 상품을 수집할 때 제공된 키워드를 기반으로 카테고리 목록과 매칭하여 상품에 카테고리 정보를 연결하는 프로세스를 구현합니다.
   * @returns 함수 실행 시간
   */
  async challenge1(dto: ProductKeywordDto): Promise<number> {
    /**
     * categoryList 가져오기
     */
    const categoryList: Category[] = await this.categoryService.findAll();
    const start = Date.now();

    /**
     * 1. dto를 ProductDto로 변환하기
     * 2. 변환된 dto를 로깅하기
     */

    const end = Date.now();
    const totalRunTime = end - start;

    console.log(dto);
    console.log(categoryList);
    console.log(totalRunTime);

    return totalRunTime;
  }
}
