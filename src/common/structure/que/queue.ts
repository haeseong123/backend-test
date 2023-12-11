export interface Queue<E> {
  /**
   * e를 큐의 끝에 추가합니다.
   */
  offer(e: E): boolean;

  /**
   * 큐의 맨 앞에서 요소를 제거하고 해당 요소를 반환합니다.
   *
   * 없으면 null을 반환합니다.
   */
  poll(): E | null;
}
