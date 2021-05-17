/**
 * 自定义可写流
 * 
 * 继承 stream 模块的 Writeable
 * 重写 _write 方法，调用 write 执行写入
 */
const { Writable } = require('stream')

class MyWriteable extends Writable {
  constructor() {
    super()
  }

  _write(chunk, en, done) {
    process.stdout.write(chunk.toString() + ' <-----')

    process.nextTick(done)
  }
}

//test
let myWriteable = new MyWriteable()

myWriteable.write('garry', 'utf-8', () => {
  console.log('end')
})