/**
 * 链表队列
 */
const LinkedList = require('./linkedList')

class Queue {
  constructor() {
    this.linkedList = new LinkedList()
  }

  enQueue(data) {
    this.linkedList.add(data)
  }

  deQueue() {
    return this.linkedList.remove(0)
  }
}

module.exports = Queue