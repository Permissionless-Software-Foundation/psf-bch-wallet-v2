/*
  Upload a file to the IPFS network.
*/

// Public NPM libraries
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

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

      const result = await this.uploadFile({ path, fileName, server })
      console.log('result: ', result)

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  async uploadFile (inObj = {}) {
    try {
      const { path, fileName, server } = inObj

      const filePath = `${path}/${fileName}`

      // Create a web form and append the file to it.
      const form = new FormData()
      const axiosConfig = {
        headers: form.getHeaders()
      }
      form.append('file', this.fs.createReadStream(filePath), fileName)

      // Send the file to the ipfs-file-stage server.
      const result = await this.axios.post(`${server}/ipfs/upload`, form, axiosConfig)

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
