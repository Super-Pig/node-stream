const fs = require('fs')
const EventEmitter = require('events')
const path = require('path')
const Queue = require('./queue')

class MyWriteStream extends EventEmitter {
  constructor(path, options = {}) {
    super()

    this.path = path
    this.flags = options.flags || 'w'
    this.mode = options.mode || 438
    this.autoClose = options.autoClose || true
    this.start = options.start || 0
    this.encoding = options.encoding || 'utf8'
    this.highWaterMark = options.highWaterMark || 16 * 1024

    this.open()

    this.writeOffset = this.start
    this.writting = false
    this.writeLen = 0
    this.needDrain = false
    this.cache = new Queue()
  }

  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        this.emit('error', err)
      } else {
        this.fd = fd
        this.emit('open', fd)
      }
    })
  }

  write(chunk, encoding, cb) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)

    this.writeLen += chunk.length

    const flag = this.writeLen < this.highWaterMark

    console.log({flag})

    this.needDrain = !flag

    if (this.writting) {
      // 当前正在执行写入，所以内容应该排队
      this.cache.enQueue({
        chunk,
        encoding,
        cb
      })
    } else {
      this.writting = true

      this._write(chunk, encoding, () => {
        cb && cb()

        // 清空排队的内容
        this._clearBuffer()
      })
    }

    return flag
  }

  _write(chunk, encoding, cb) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, encoding, cb))
    }

    fs.write(this.fd, chunk, 0, chunk.length, this.writeOffset, (err, written) => {
      this.writeOffset += written
      this.writeLen -= written

      cb && cb()
    })
  }

  _clearBuffer() {
    let data = this.cache.deQueue()

    if (data) {
      this._write(data.element.chunk, data.element.encoding, () => {
        data.element.cb && data.element.cb()
        this._clearBuffer()
      })
    } else {
      if (this.needDrain) {
        this.needDrain = false
        this.writting = false
        this.emit('drain')
      }
    }
  }
}

module.exports = MyWriteStream

// test
const ws = new MyWriteStream(path.join(__dirname, 'a.txt'), {
  highWaterMark: 1
})

ws.write('1', 'utf8', () => { })
// ws.write('10', 'utf8', () => { })
// ws.write('garry', 'utf8', () => { })

// ws.on('drain', ()=> console.log('drain'))


