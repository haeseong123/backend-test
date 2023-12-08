import { Category } from 'src/entity/product/category/category.entity';

export class CategoryDto {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static of(category: Category): CategoryDto {
    const dto = new CategoryDto(category.id, category.name);

    return dto;
  }
}
