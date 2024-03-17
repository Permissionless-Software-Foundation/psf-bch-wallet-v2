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

      const path = `${__dirname.toString()}/../../ipfs-files`
      const fileName = flags.fileName

      await this.uploadFile({ path, fileName })

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  async uploadFile (inObj = {}) {
    try {
      const { path, fileName } = inObj

      const server = this.walletUtil.getPsffppClient()

      const result = await this.axios.post(`${server.psffppURL}/ipfs/upload`, {
        path,
        fileName
      })
      console.log(`upload result: ${JSON.stringify(result.data, null, 2)}`)

      return result.data
    } catch (err) {
      console.error('Error in uploadFile()')
      throw err
    }
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
