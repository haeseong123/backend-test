import { CategoryDto } from '../category/dto/category.dto';

export class ProductDto {
  name: string;
  categoryDto: CategoryDto;

  constructor(name: string, categoryDto: CategoryDto) {
    this.name = name;
    this.categoryDto = categoryDto;
  }
}
