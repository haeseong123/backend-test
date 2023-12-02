export class TranslateWord {
  /**
   * 치환 대상
   */
  src: string;

  /**
   * 치환 결과
   */
  dest: string;

  constructor(src: string, dest: string) {
    this.src = src;
    this.dest = dest;
  }
}
