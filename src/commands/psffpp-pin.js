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
const PsffppUpload = require('./psffpp-upload')

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
    this.tempTest = this.tempTest.bind(this)
    this.getFileSize = this.getFileSize.bind(this)
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsPin)

      // const server = this.walletUtil.getRestServer()

      const filename = `${__dirname.toString()}/../../.wallets/${
        flags.name
      }.json`

      // await this.pinCid({flags, filename})
      await this.tempTest({ flags, filename })

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  async tempTest (inObj = {}) {
    console.log('tempTest() fired')

    try {
      const { flags, filename } = inObj

      // Load the wallet file.
      const walletJSON = require(filename)
      const walletData = walletJSON.wallet

      const advancedConfig = this.walletUtil.getRestServer()
      this.bchWallet = new this.BchWallet(walletData.mnemonic, advancedConfig)

      const path = `${__dirname.toString()}/../../ipfs-files`
      const filePath = `${path}/${flags.file}`

      // Get the size of the file.
      const sizeMb = await this.getFileSize({ filePath })

      // Wait for the wallet to initialize and retrieve UTXO data from the
      // blockchain.
      await this.bchWallet.walletInfoPromise
      await this.bchWallet.initialize()

      // Instantiate the PSFFPP library.
      let PSFFPP = await import('psffpp')
      PSFFPP = PSFFPP.default
      const psffpp = new PSFFPP({ wallet: this.bchWallet })
      // console.log('psffpp: ', psffpp)

      // Get the cost to write 1MB to the PSFFPP network.
      const writePrice = await psffpp.getMcWritePrice()
      console.log('writePrice: ', writePrice)

      // Upload the file to the IPFS node and get a CID.
      const uploadResult = await this.psffppUpload.uploadFile({ path, fileName: flags.file })
      const cid = uploadResult.cid
      console.log('cid: ', cid)

      // Calculate the write cost
      // const dataCost = writePrice * sizeMb
      // const minCost = writePrice
      // let actualCost = minCost
      // if (dataCost > minCost) actualCost = dataCost
      // console.log(`Burning ${actualCost} PSF tokens for ${sizeMb} MB of data.`)

      // Generate a PoB
      // const PSF_TOKEN_ID = '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0'
      // const pobTxid = await this.bchWallet.burnTokens(actualCost, PSF_TOKEN_ID)
      // console.log(`Proof-of-burn TX: ${pobTxid}`)

      // Generate a Pin Claim
      const pinObj = {
        cid,
        filename: flags.file,
        fileSizeInMegabytes: sizeMb
      }
      const { pobTxid, claimTxid } = await psffpp.createPinClaim(pinObj)
      console.log('pobTxid: ', pobTxid)
      console.log('claimTxid: ', claimTxid)
    } catch (err) {
      console.error('Error in tempTest()')
      throw err
    }
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

      console.log(`File ${filePath} is ${fileSizeInMegabytes} MB.`)

      return fileSizeInMegabytes
    } catch (err) {
      console.error('Error in getFileSize()')
      throw err
    }
  }

  // Pin a CID. Use the selected wallet for payment.
  // async pidCid (inObj = {}) {
  //   try {
  //     const { filename } = inObj
  //
  //     // Load the wallet file.
  //     const walletJSON = require(filename)
  //     const walletData = walletJSON.wallet
  //
  //     const advancedConfig = this.walletUtil.getRestServer()
  //     this.bchWallet = new this.BchWallet(walletData.mnemonic, advancedConfig)
  //
  //     // Wait for the wallet to initialize and retrieve UTXO data from the
  //     // blockchain.
  //     await this.bchWallet.walletInfoPromise
  //     await this.bchWallet.initialize()
  //
  //     // Instantiate the PSFFPP library.
  //     const PSFFPP = await import('psffpp')
  //     const psffpp = new PSFFPP({ wallet: this.bchWallet })
  //
  //     // Get the cost to write 1MB to the PSFFPP network.
  //     const writePrice = await psffpp.getMcWritePrice()
  //     console.log('writePrice: ', writePrice)
  //
  //     // Get the size of the file.
  //
  //     // Upload the file to the IPFS node and get a CID.
  //
  //     // Generate a PoB
  //
  //     // Generate a Pin Claim
  //
  //     return true
  //   } catch (err) {
  //     console.error('Error in pidCid()')
  //     throw err
  //   }
  // }
}

IpfsPin.description = 'Pin a file to the PSFFPP network'

IpfsPin.flags = {
  file: flags.string({
    char: 'f',
    description: 'filename to pin'
  }),

  name: flags.string({ char: 'n', description: 'Name of wallet' })
}

module.exports = IpfsPin
