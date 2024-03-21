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

    // Bind 'this' object to all subfunctions
    this.run = this.run.bind(this)
    this.validateFlags = this.validateFlags.bind(this)
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsDownload)

      // Validate input flags
      this.validateFlags(flags)

      const server = this.walletUtil.getPsffppClient()
      // console.log('server: ', server)

      const path = `${__dirname.toString()}/../../ipfs-files`

      await this.downloadCid({ server: server.psffppURL, path, flags })

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  async downloadCid (inObj = {}) {
    try {
      const { server, path, flags } = inObj

      const result = await this.axios.post(`${server}/ipfs/download`, {
        cid: flags.cid,
        path,
        fileName: flags.fileName
      })
      // console.log(`download result: ${JSON.stringify(result.data, null, 2)}`)

      return result.data
    } catch (err) {
      console.error('Error in downloadCid()')
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    const fileName = flags.fileName
    if (!fileName || fileName === '') {
      throw new Error('You must specify a fileName with the -f flag, to name the downloaded file.')
    }

    const cid = flags.cid
    if (!cid || cid === '') {
      throw new Error('You must specify an IPFS CID with the -c flag.')
    }

    return true
  }
}

IpfsDownload.description = `Download a file, given its CID.

IPFS files do not retain the original filename. This command will download a
file given its CID, then rename the download to the given filename.
`

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
