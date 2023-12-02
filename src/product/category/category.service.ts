import { Category } from 'src/entity/product/category/category.entity';

export class CategoryService {
  constructor() {}

  /**
   * @returns categoryList
   */
  async findAll(): Promise<Category[]> {
    const categoryList: Category[] = [
      { id: 1, name: '가구' },
      { id: 2, name: '공구' },
      { id: 3, name: '의류' },
    ];
    [...new Array(10000)].forEach((_, index) => {
      categoryList.push({ id: index + 4, name: `카테고리${index + 4}` });
    });

    return categoryList;
  }
}
