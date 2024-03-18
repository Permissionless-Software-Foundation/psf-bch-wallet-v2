/*
  Upload a file to the IPFS network.
*/

// Public NPM libraries
const axios = require('axios')

// Local libraries
const WalletUtil = require('../lib/wallet-util')

const { Command, flags } = require('@oclif/command')

class IpfsUpload extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.axios = axios
    this.walletUtil = new WalletUtil()

    // Bind 'this' object to all subfunctions.
    this.run = this.run.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsUpload)

      // Validate input flags
      this.validateFlags(flags)

      const path = `${__dirname.toString()}/../../ipfs-files`
      const fileName = flags.fileName

      let server = this.walletUtil.getPsffppClient()
      server = server.psffppURL

      await this.uploadFile({ path, fileName, server })

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  async uploadFile (inObj = {}) {
    try {
      const { path, fileName, server } = inObj

      const result = await this.axios.post(`${server}/ipfs/upload`, {
        path,
        fileName
      })
      // console.log(`upload result: ${JSON.stringify(result.data, null, 2)}`)

      return result.data
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

IpfsUpload.description = `Upload a file to the IPFS node

If you are trying to pin a file to the PSFFPP network, you do not need to run
this command. This command is automatically  used by the psffpp-pin command to
upload the file.

This command is useful in isolation if you want to test uploading and passing
files between IPFS nodes, independant of the PSFFPP.
`

IpfsUpload.flags = {
  fileName: flags.string({
    char: 'f',
    description: 'filename to upload'
  })
}

module.exports = IpfsUpload
