/**
 * 自定义双工流
 * 继承 Duplex 类
 * 重写 _read 方法，调用 push 产出数据
 * 重写 _write 方法，调用 wirte 消费数据
 */
const { Duplex } = require('stream')

class MyDuplex extends Duplex {
  constructor(source) {
    super()

    this.source = source
  }

  _read() {
    let data = this.source.shift() || null

    this.push(data)
  }

  _write(chunk, en, next) {
    process.stdout.write(chunk)

    process.nextTick(next)
  }
}

// test
const myDuplex = new MyDuplex(['a', 'b', 'c'])

// myDuplex.on('data', chunk => {
//   console.log(chunk.toString())
// })

myDuplex.write('garry', () => {
  console.log('done')
})