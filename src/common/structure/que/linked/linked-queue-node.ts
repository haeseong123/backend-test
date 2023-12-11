export class LinkedQueueNode<E> {
  data: E;
  next: LinkedQueueNode<E> | null;

  constructor(data: E, next: LinkedQueueNode<E> | null) {
    this.data = data;
    this.next = next;
  }
}
