/*
  Download a file from the IPFS network.
*/

// Public NPM libraries
const axios = require('axios')
const fs = require('fs')

// Local libraries
const WalletUtil = require('../lib/wallet-util')

const { Command, flags } = require('@oclif/command')

class IpfsDownload2 extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.axios = axios
    this.walletUtil = new WalletUtil()
    this.fs = fs

    // Bind 'this' object to all subfunctions
    this.run = this.run.bind(this)
    this.validateFlags = this.validateFlags.bind(this)
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsDownload2)

      // Validate input flags
      this.validateFlags(flags)

      let server = this.walletUtil.getRestServer()
      server = server.restURL
      console.log('server: ', server)

      const path = `${__dirname.toString()}/../../ipfs-files`

      await this.downloadCid({ server, path, flags })

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  async downloadCid (inObj = {}) {
    try {
      const { server, path, flags } = inObj

      const { cid } = flags

      // Get pinning data and the filename for this CID.
      const infoUrl = `${server}/ipfs/file-info/${cid}`
      // console.log('infoUrl: ', infoUrl)
      const result = await this.axios.get(infoUrl)
      const fileInfo = result.data

      const pinStatus = fileInfo.fileMetadata.dataPinned
      if (!pinStatus) {
        throw new Error(`CID ${cid} is has not been pinned by the connected ipfs-file-pin-service. Try connecting to a different instance of the file service.`)
      }

      const filename = fileInfo.fileMetadata.filename
      console.log(`CID ${cid} has a filename of ${filename}. Downloading...`)

      const filePath = `${path}/${filename}`

      const writableStream = this.fs.createWriteStream(filePath)

      writableStream.on('error', this.writeStreamError)

      writableStream.on('finish', this.writeStreamFinished)

      const url = `${server}/ipfs/view/${cid}`
      console.log('url: ', url)
      const result2 = await this.axios.get(url, { responseType: 'stream' })
      // console.log(`download result: ${JSON.stringify(result.data, null, 2)}`)

      console.log('typeof result2.data: ', typeof result2.data)

      const fileReadStream = result2.data

      // const fileData = new Buffer(result.data)

      for await (const buf of fileReadStream) {
        writableStream.write(buf)
      }

      writableStream.end()

      console.log(`...download complete. File ${filename} saved to the ipfs-files directory.`)

      // return result.data
      return true
    } catch (err) {
      console.error('Error in downloadCid()')
      throw err
    }
  }

  writeStreamError (error) {
    console.log(`An error occured while writing to the file. Error: ${error.message}`)

    return true
  }

  writeStreamFinished () {
    console.log('File has finished downloading.')

    return true
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    const cid = flags.cid
    if (!cid || cid === '') {
      throw new Error('You must specify an IPFS CID with the -c flag.')
    }

    return true
  }
}

IpfsDownload2.description = `Download a file, given its CID.

Query the ipfs-bch-wallet-consumer for a given CID. If the file is pinned by
the ipfs-file-pin-service connected to it, it will attempt to download the
file to the ipfs-files directory.
`

IpfsDownload2.flags = {
  cid: flags.string({
    char: 'c',
    description: 'CID of file to download'
  })
}

module.exports = IpfsDownload2
