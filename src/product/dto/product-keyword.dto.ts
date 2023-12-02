export class ProductKeywordDto {
  /**
   * 카테고리 이름
   */
  keyword: string;

  /**
   * 상품명
   */
  name: string;

  constructor(name: string, keyword: string) {
    this.name = name;
    this.keyword = keyword;
  }
}
