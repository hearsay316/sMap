const Client = require('ssh2-sftp-client')
const path = require('path')
const fs = require('fs')
class UploadSshPlugin {
  constructor(options) {
    this.config = options
    this.client = new Client('upload-test')
    this.dst = '/home/cdn/webgl/'
    this.src = path.resolve(__dirname, '../dist')
  }
  apply(compiler) {
    compiler.hooks.done.tap('UploadSshPlugin', stats => {
        this.upload().then(msg => {
          console.log(msg, '上传完成')
        })
          .catch(err => {
            console.log(`main error: ${err.message}`, this.index)
          })
    })
  }
  async upload() {
    try {
      await this.client.connect(this.config)
      const exists = await this.client.exists(this.dst)

        this.client.on('upload', info => {
          console.log(`Listener: Uploaded ${info.source}`)
        })
        const rslt = await this.client.uploadDir(this.src, this.dst)
        return rslt
    } finally {
      this.client.end()
    }
  }
}
module.exports = UploadSshPlugin
