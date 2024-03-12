/*
  Download a file from the IPFS network.
*/

// Public NPM libraries
const axios = require('axios')

// Local libraries
const WalletUtil = require('../lib/wallet-util')

const { Command, flags } = require('@oclif/command')

class IpfsDownload extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.axios = axios
    this.walletUtil = new WalletUtil()
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsDownload)

      const server = this.walletUtil.getRestServer()

      // const result = await this.axios.get(`${server.restURL}/ipfs/download/${flags.cid}`)
      // console.log(`download result: ${JSON.stringify(result.data, null, 2)}`)

      const result = await this.axios.post(`${server.restURL}/ipfs/download`, {
        cid: flags.cid,
        path: `${__dirname.toString()}/../../ipfs-files`,
        fileName: flags.fileName
      })
      console.log(`download result: ${JSON.stringify(result.data, null, 2)}`)

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }
}

IpfsDownload.description = 'Download a file, given its CID.'

IpfsDownload.flags = {
  cid: flags.string({
    char: 'c',
    description: 'CID of file to download'
  }),

  fileName: flags.string({
    char: 'f',
    description: 'filename to apply to the downloaded file'
  })
}

module.exports = IpfsDownload
