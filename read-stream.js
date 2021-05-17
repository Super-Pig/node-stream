/**
 * 模拟实现文件可读流
 */
const fs = require('fs')
const EventEmitter = require('events')
const path = require('path')

class MyFileReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super()
    this.path = path
    this.flags = options.flags || 'r'
    this.mode = options.mode || 438
    this.autoClose = options.autoClose || true
    this.start = options.start || 0
    this.end = options.end
    this.highWaterMark = options.highWaterMark || 64 * 1024
    this.readOffset = 0
    this.isPause = false

    this.open()

    this.on('newListener', type => {
      if (type === 'data') {
        this.read()
      }
    })
  }

  open() {
    // 原生 open 方法来打开指定位置的文件
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        this.emit('error', err)
      } else {
        this.fd = fd
        this.emit('open', fd)
      }
    })
  }

  read() {
    if (this.isPause) {
      return
    }

    if (typeof this.fd !== 'number') {
      return this.once('open', this.read)
    }

    const buf = Buffer.alloc(this.highWaterMark)

    const howMuchToRead = this.end ? Math.min(this.end - this.readOffset + 1, this.highWaterMark)
      : this.highWaterMark

    // 调用原生 read 方法读取数据
    fs.read(this.fd, buf, 0, howMuchToRead, this.readOffset, (err, readBytes) => {
      if (readBytes) {
        this.readOffset += readBytes
        this.emit('data', buf.slice(0, readBytes))
        this.read()
      } else {
        this.emit('end')
        this.close()
      }
    })
  }

  close() {
    fs.close(this.fd, () => {
      this.emit('close')
    })
  }

  pipe(ws) {
    this.on('data', data => {
      const flag = ws.write(data)

      if (!flag) {
        this.pause()
      }
    })

    ws.on('drain', () => {
      console.log('drain')

      this.resume()
    })
  }

  pause() {
    console.log('pause')

    this.isPause = true
  }

  resume() {
    console.log('resume')

    this.isPause = false
    this.read()
  }
}

module.exports = MyFileReadStream

//test

// let rs = new MyFileReadStream(path.join(__dirname, 'data.txt'), {
//   highWaterMark: 3,
//   end: 3
// })

// rs.on('open', fd => {
//   console.log(fd)
// })

// rs.on('error', err => {
//   console.log(err)
// })

// rs.on('data', chunk => {
//   console.log(chunk)
//   // console.log(chunk.toString('utf-8'))
// })

// rs.on('end', () => {
//   console.log('end')
// })

// rs.on('close', () => {
//   console.log('close')
// })