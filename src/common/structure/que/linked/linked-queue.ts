import { Queue } from '../queue';
import { LinkedQueueNode } from './linked-queue-node';

export class LinkedQueue<E> implements Queue<E> {
  first: LinkedQueueNode<E> | null;
  last: LinkedQueueNode<E> | null;

  constructor() {
    this.first = null;
    this.last = null;
  }

  offer(e: E): boolean {
    const newNode = new LinkedQueueNode<E>(e, null);
    const l = this.last;
    this.last = newNode;

    if (l === null) {
      this.first = newNode;
    } else {
      l.next = newNode;
    }

    return true;
  }

  poll(): E | null {
    if (this.first === null) {
      return null;
    }

    const e = this.first.data;
    const next = this.first.next;
    this.first = next;
    if (next == null) {
      this.last = null;
    }

    return e;
  }
}
