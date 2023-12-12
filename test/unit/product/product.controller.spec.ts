import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from 'src/product/product.controller';
import { ProductService } from 'src/product/product.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const productServiceMock = {
      challenge1: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('challenge1 호출', () => {
    it('성공', async () => {
      // Given
      const expectValue = 1;

      jest.spyOn(productService, 'challenge1').mockReturnValue(expectValue);

      // When
      const result = productController.challenge1();

      // Then
      expect(result).toBe(expectValue);
    });
  });
});
