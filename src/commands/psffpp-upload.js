/*
  Upload a file to the IPFS network.
*/

// Public NPM libraries
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const fsP = require('fs/promises')
const multipipe = require('multipipe')
const stream = require('node:stream')

// Local libraries
const WalletUtil = require('../lib/wallet-util')

const { Command, flags } = require('@oclif/command')

class IpfsUpload2 extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.axios = axios
    this.walletUtil = new WalletUtil()
    this.fs = fs
    this.fsP = fsP
    this.multipipe = multipipe

    // Bind 'this' object to all subfunctions.
    this.run = this.run.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsUpload2)

      // Validate input flags
      this.validateFlags(flags)

      const path = `${__dirname.toString()}/../../ipfs-files`
      const fileName = flags.fileName

      let server = this.walletUtil.getPsffppClient()
      server = server.psffppURL

      const fileOrDir = await this.isFileOrDirectory(`${path}/${fileName}`)

      if (!fileOrDir) throw new Error(`${fileName} is not a file or directory.`)

      let readStream
      if (fileOrDir === 1) {
        readStream = await this.uploadFile({ path, fileName })
      } else if (fileOrDir === 2) {
        readStream = await this.uploadDir({ path, fileName })
      }
      console.log('readStream: ', readStream)

      const result = await this.uploadStream({ readStream, fileName, server })

      console.log('result: ', result)

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  // Take the readable stream and upload it to the file staging server.
  async uploadStream (inObj = {}) {
    try {
      const { readStream, fileName, server } = inObj

      // Create a web form and append the readable stream to it.
      const form = new FormData()
      const axiosConfig = {
        headers: form.getHeaders()
      }
      console.log('fileName: ', fileName)
      console.log('readStream: ', readStream)
      console.log('ping01')
      form.append('file', readStream, fileName)
      console.log('ping02')

      // Send the file to the ipfs-file-stage server.
      const result = await this.axios.post(`${server}/ipfs/upload`, form, axiosConfig)
      console.log('ping03')

      return result.data
    } catch (err) {
      console.error('Error in uploadStream()')
      throw err
    }
  }

  // This function converts a directory and all the files it contains into a
  // readable stream.
  async uploadDir (inObj = {}) {
    try {
      const { path, fileName } = inObj

      // Create an array of readable streams for each file in the directory.
      const createDirectoryStream = async (directoryPath) => {
        const files = await this.fsP.readdir(directoryPath)
        const streams = files.map(async (file) => {
          console.log('file: ', file)
          const filePath = `${directoryPath}/${file}`
          return this.fs.createReadStream(filePath)
        })
        return streams
      }

      const directoryStream = await createDirectoryStream(`${path}/${fileName}`)
      for (let i = 0; i < directoryStream.length; i++) {
        directoryStream[i] = await directoryStream[i]
      }
      console.log('directoryStream: ', directoryStream)
      // directoryStream.forEach((stream) => {
      //   // Use the stream, e.g., pipe to a writable stream or use with a library like pump
      //   stream.pipe(/* ... */);
      // });

      // const myStream = stream.Readable.from(directoryStream)

      // const mergedStream = stream.pipe(stream.merge())

      // const mergedStream = new stream.Readable({
      //   readableObjectMode: true,
      //   objectMode: true
      // })

      // directoryStream.forEach((stream) => {
      //   stream.pipe(mergedStream, { end: false });
      // });

      const mergedStream = stream.Readable.from(directoryStream)

      // const mergedStream = await multipipe(...directoryStream)
      console.log('mergedStream: ', mergedStream)

      return mergedStream
    } catch (err) {
      console.error('Error in uploadDir(): ', err)
      throw err
    }
  }

  // Returns an integer. The return value represents:
  // 0 = not a directory or file
  // 1 = a file
  // 2 = a directory
  async isFileOrDirectory (path) {
    try {
      const stats = await this.fsP.stat(path)
      console.log('stats: ', stats)

      if (stats.isFile()) {
        return 1
      } else if (stats.isDirectory()) {
        return 2
      } else {
        return 0
      }
    } catch (error) {
      console.error(`Error checking path in isFileOrDirectory(): ${path}`, error)
    }
  }

  async uploadFile (inObj = {}) {
    try {
      const { path, fileName, server } = inObj

      const filePath = `${path}/${fileName}`

      const fileStream = this.fs.createReadStream(filePath)

      return fileStream
    } catch (err) {
      console.error('Error in uploadFile()')
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    const fileName = flags.fileName
    if (!fileName || fileName === '') {
      throw new Error('You must specify a fileName with the -f flag, to name the downloaded file.')
    }

    return true
  }
}

IpfsUpload2.description = `Upload a file to the psffpp-client

This command will upload a file to the psffpp-client via the REST API.
`

IpfsUpload2.flags = {
  fileName: flags.string({
    char: 'f',
    description: 'filename to upload'
  })
}

module.exports = IpfsUpload2
