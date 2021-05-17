/**
 * 自定义可读流
 * 
 * 继承 stream 里的 Readable
 * 重写 _read 方法，调用 push 产出数据
 */

const { Readable } = require('stream')

class MyReadable extends Readable {
  constructor(source) {
    super()

    this.source = source
  }

  _read() {
    let data = this.source.shift() || null

    this.push(data)
  }
}

// test
let source = ['1', '2', '3', '4']
let myReadable = new MyReadable(source)

// myReadable.on('readable', () => {
//   let data = null

//   while ((data = myReadable.read()) !== null) {
//     console.log(data.toString())
//   }
// })

myReadable.on('data', chunk => {
  console.log(chunk.toString())
})