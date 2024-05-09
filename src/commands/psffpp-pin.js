/*
  Pin a file to the PSF IPFS network using the PSFFPP.

  This command leverages the psffpp-upload command. It will upload the file
  using that command, then use the CID returned by that command to generate
  a Proof-of-Burn and a Pin Claim transaction.
*/

// Public NPM libraries
const axios = require('axios')
const BchWallet = require('minimal-slp-wallet')
const fs = require('fs')

// Local libraries
const WalletUtil = require('../lib/wallet-util')
const PsffppUpload = require('./psffpp-upload2')

const { Command, flags } = require('@oclif/command')

class IpfsPin extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.axios = axios
    this.walletUtil = new WalletUtil()
    this.BchWallet = BchWallet
    this.fs = fs
    this.psffppUpload = new PsffppUpload()

    // Bind 'this' object to all subfunctions.
    this.run = this.run.bind(this)
    // this.pinCid = this.pinCid.bind(this)
    this.pinFile = this.pinFile.bind(this)
    this.getFileSize = this.getFileSize.bind(this)
    this.validateFlags = this.validateFlags.bind(this)
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsPin)

      this.validateFlags(flags)

      const walletFile = `${__dirname.toString()}/../../.wallets/${
        flags.name
      }.json`

      await this.pinFile({ flags, walletFile })

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  // Pin a file to the PSF network using the PSFFPP.
  async pinFile (inObj = {}) {
    try {
      const { flags } = inObj

      // Instantiate minimal-slp-wallet.
      this.bchWallet = await this.walletUtil.instanceWallet(flags.name)
      // const walletData = this.bchWallet.walletInfo

      const path = `${__dirname.toString()}/../../ipfs-files`
      const filePath = `${path}/${flags.fileName}`

      // Get the size of the file.
      const sizeMb = await this.getFileSize({ filePath })

      // Instantiate the PSFFPP library.
      const psffpp = await this.importPsffpp(this.bchWallet)

      // Get the cost to write 1MB to the PSFFPP network.
      const writePrice = await psffpp.getMcWritePrice()
      console.log('writePrice: ', writePrice)

      // Upload the file to the IPFS node and get a CID.
      let psffppClient = this.walletUtil.getPsffppClient()
      psffppClient = psffppClient.psffppURL
      const uploadResult = await this.psffppUpload.uploadFile({
        path,
        fileName: flags.fileName,
        server: psffppClient
      })
      const cid = uploadResult.cid
      console.log('cid: ', cid)

      // Generate a Pin Claim
      const pinObj = {
        cid,
        filename: flags.fileName,
        fileSizeInMegabytes: sizeMb
      }
      const { pobTxid, claimTxid } = await psffpp.createPinClaim(pinObj)
      console.log('pobTxid: ', pobTxid)
      console.log('claimTxid: ', claimTxid)

      return {
        pobTxid,
        claimTxid
      }
    } catch (err) {
      console.error('Error in pinFile()')
      throw err
    }
  }

  // Dynamically import the ESM PSFFPP library.
  async importPsffpp (wallet) {
    // Instantiate the PSFFPP library.
    let PSFFPP = await import('psffpp')
    PSFFPP = PSFFPP.default
    const psffpp = new PSFFPP({ wallet })

    return psffpp
  }

  // Returns the size of the file in Megabytes.
  async getFileSize (inObj = {}) {
    try {
      const { filePath } = inObj

      const stats = fs.statSync(filePath)
      const fileSizeInBytes = stats.size
      let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)

      // Round the file size to two decimal points
      fileSizeInMegabytes = fileSizeInMegabytes * 100
      fileSizeInMegabytes = Math.ceil(fileSizeInMegabytes)
      fileSizeInMegabytes = fileSizeInMegabytes / 100

      // console.log(`File ${filePath} is ${fileSizeInMegabytes} MB.`)

      return fileSizeInMegabytes
    } catch (err) {
      console.error('Error in getFileSize()')
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    const fileName = flags.fileName
    if (!fileName || fileName === '') {
      throw new Error('You must specify a fileName with the -f flag, to name the downloaded file.')
    }

    const name = flags.name
    if (!name || name === '') {
      throw new Error('You must specify a wallet with the -n flag.')
    }

    return true
  }
}

IpfsPin.description = `Pin a file to the PSFFPP network

This command leverages the psffpp-upload command. It will upload the file
using that command, then use the CID returned by that command to generate
a Proof-of-Burn and a Pin Claim transaction.
`

IpfsPin.flags = {
  fileName: flags.string({
    char: 'f',
    description: 'fileName to pin to PSF network'
  }),

  name: flags.string({ char: 'n', description: 'Name of wallet' })
}

module.exports = IpfsPin
