/**
 * 单向链表
 */
const Node = require('./linkNode')

class LinkedList {
  constructor() {
    this.head = null
    this.size = 0
  }

  _getNode(index) {
    if (index < 0 || index >= this.index) {
      throw new Error('越界了')
    }

    let currentNode = this.head

    for (let i = 0; i < index; i++) {
      currentNode = currentNode.next
    }

    return currentNode
  }

  add(index, element) {
    if (arguments.length === 1) {
      element = index
      index = this.size
    }

    if (index < 0 || index > this.size) {
      throw new Error('cross the border')
    }

    if (index === 0) {
      const head = this.head
      const newNode = new Node(element, head)
      this.head = newNode
    } else {
      const prevNode = this._getNode(index - 1)
      const newNode = new Node(element, prevNode.next)
      prevNode.next = newNode
    }

    this.size++
  }

  remove(index) {
    let rmNode = null

    if (index === 0) {
      rmNode = this.head

      if(!rmNode) {
        return undefined
      }

      this.head = rmNode.next
    } else {
      const prevNode = this._getNode(index - 1)
      rmNode = prevNode.next
      prevNode.next = rmNode.next
    }

    this.size--

    return rmNode
  }

  set(index, element) {
    const node = this._getNode(index)
    node.element = element
  }

  get(index) {
    return this._getNode(index)
  }

  clear() {
    this.head = null
    this.size = 0
  }
}

module.exports = LinkedList