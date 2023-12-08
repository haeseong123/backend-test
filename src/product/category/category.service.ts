import { BadRequestException } from '@nestjs/common';
import { ErrorMessage } from 'src/common/exception/error-message';
import { Category } from 'src/entity/product/category/category.entity';

export class CategoryService {
  constructor() {}

  /**
   * 현재 categoryList에서 name과 매칭되는 category를 찾는 동작의 시간 복잡도는 O(N)
   *
   * 이것이 너무 길다 싶으면 categoryList를 Map 형태로 변환하여 O(1) 시간에 동작하도록 바꿀 수 있음
   * 단, list를 map으로 변환하는 과정이 O(N)이므로 한 번 가져온 값을 캐싱하여 사용해야 함
   *
   * @param name 카테고리 이름
   * @returns 매칭된 카테고리
   */
  findByNameOrThrow(name: string): Category {
    const categoryList = this.findAll();
    const category = categoryList.find((category) => category.name === name);

    if (!category) {
      throw new BadRequestException(ErrorMessage.CATEGORY_KEYWORD_NOT_MATCHED);
    }

    return category;
  }

  /**
   * 실사용 시 repository를 사용하여
   * DB에 있는 category를 전부 가져오는 방식으로 동작
   *
   * @returns categoryList
   */
  findAll(): Category[] {
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
