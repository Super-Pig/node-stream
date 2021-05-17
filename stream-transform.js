/**
 * 自定义转换流
 * 继承 Transform 类
 * 重写 _transform 方法，调用 push 和 callback
 * 重写 _flush 方法，处理剩余数据
 */
const { Transform } = require('stream')

class MyTransform extends Transform {
  constructor() {
    super()
  }

  _transform(chunk, en, cb) {
    this.push(chunk.toString().toUpperCase())

    cb(null)
  }
}

// test
const t = new MyTransform()

t.write('a')
t.write('b')
t.end('c')

t.on('data', chunk => {
  console.log(chunk.toString())
})