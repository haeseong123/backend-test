import { Test, TestingModule } from '@nestjs/testing';
import { Category } from 'src/entity/product/category/category.entity';
import { CategoryService } from 'src/product/category/category.service';
import { ProductKeywordDto } from 'src/product/dto/product-keyword.dto';
import { ProductService } from 'src/product/product.service';

describe('ProductService', () => {
  let productService: ProductService;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const categoryServiceMock = {
      findByNameOrThrow: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: CategoryService, useValue: categoryServiceMock },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  describe('challenge1 호출', () => {
    it('성공', () => {
      // Given
      const dto: ProductKeywordDto = new ProductKeywordDto(
        '예제 상품명',
        '가구',
      );
      const category: Category = new Category(1, '가구');
      const categorySpy = jest.spyOn(categoryService, 'findByNameOrThrow');

      categorySpy.mockReturnValue(category);

      // When
      productService.challenge1(dto);

      // Then
      expect(categorySpy).toHaveBeenCalledWith(dto.keyword);
    });
  });
});
