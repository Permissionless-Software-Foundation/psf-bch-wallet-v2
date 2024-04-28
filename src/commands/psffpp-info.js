/*
  Get info on a CID from the ipfs-file-pin-service.
  This is a good way to check if a CID has been pinned by that node.
*/

// Public NPM libraries
const axios = require('axios')

// Local libraries
const WalletUtil = require('../lib/wallet-util')

const { Command, flags } = require('@oclif/command')

class PsffppInfo extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.axios = axios
    this.walletUtil = new WalletUtil()

    // Bind 'this' object to all subfunctions
    this.run = this.run.bind(this)
    this.validateFlags = this.validateFlags.bind(this)
  }

  async run () {
    try {
      const { flags } = this.parse(PsffppInfo)

      // Validate input flags
      this.validateFlags(flags)

      let server = this.walletUtil.getRestServer()
      server = server.restURL
      // console.log('server: ', server)

      const info = await this.cidInfo({ server, flags })
      console.log(`File info: ${JSON.stringify(info, null, 2)}`)

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  async cidInfo (inObj = {}) {
    try {
      const { server, flags } = inObj

      const { cid } = flags

      const url = `${server}/ipfs/file-info/${cid}`
      // console.log('url: ', url)
      const result = await this.axios.get(url)
      // console.log(`download result: ${JSON.stringify(result.data, null, 2)}`)
      const info = result.data

      return info
      // return true
    } catch (err) {
      console.error('Error in cidInfo()')
      throw err
    }
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

PsffppInfo.description = `Download a file, given its CID.

Query the ipfs-bch-wallet-consumer for a given CID. It will request the file
status from the ipfs-file-pin-service connected to it. This is a good way
to check if the file has been pinned by that service.
`

PsffppInfo.flags = {
  cid: flags.string({
    char: 'c',
    description: 'CID of file to download'
  })
}

module.exports = PsffppInfo
