import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorMessage } from 'src/common/exception/error-message';
import { Category } from 'src/entity/product/category/category.entity';
import { CategoryService } from 'src/product/category/category.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
  });

  describe('findByNameOrThrow 호출', () => {
    it('성공', () => {
      // Given
      const name = 'name';
      const category = new Category(1, name);
      const categoryList = [category];

      jest.spyOn(categoryService, 'findAll').mockReturnValue(categoryList);

      // When
      const result = categoryService.findByNameOrThrow(name);

      // Then
      expect(result).toStrictEqual(category);
    });

    it('실패: name에 일치하는 category 존재하지 않음', () => {
      // Given
      const name = 'name';
      const categoryList: Category[] = [];

      jest.spyOn(categoryService, 'findAll').mockReturnValue(categoryList);

      // When
      // Then
      expect(() => categoryService.findByNameOrThrow(name)).toThrow(
        BadRequestException,
      );
      expect(() => categoryService.findByNameOrThrow(name)).toThrow(
        ErrorMessage.CATEGORY_KEYWORD_NOT_MATCHED,
      );
    });
  });

  describe('findAll 호출', () => {
    it('성공', () => {
      // Given
      const categoryList: Category[] = [
        { id: 1, name: '가구' },
        { id: 2, name: '공구' },
        { id: 3, name: '의류' },
      ];
      [...new Array(10000)].forEach((_, index) => {
        categoryList.push({ id: index + 4, name: `카테고리${index + 4}` });
      });

      // When
      const result = categoryService.findAll();

      // Then
      expect(result).toStrictEqual(categoryList);
    });
  });
});
