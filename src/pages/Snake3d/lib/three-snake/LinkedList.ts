import ListNode from './ListNode';

export default class LinkedList<T> {
  head: ListNode<T> | null = null;

  add(data: T): ListNode<T> {
    const node = new ListNode(data);
    node.next = this.head;
    this.head = node;
    return node;
  }
} 
