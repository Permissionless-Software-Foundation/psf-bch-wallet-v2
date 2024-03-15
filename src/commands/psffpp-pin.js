/*
  Pin a file to the PSF IPFS network using the PSFFPP.

  This command leverages the psffpp-upload command. It will upload the file
  using that command, then use the CID returned by that command to generate
  a Proof-of-Burn and a Pin Claim transaction.
*/

// Public NPM libraries
const axios = require('axios')
const BchWallet = require('minimal-slp-wallet')
const PSFFPP = require('psffpp')

// Local libraries
const WalletUtil = require('../lib/wallet-util')

const { Command, flags } = require('@oclif/command')

class IpfsPin extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.axios = axios
    this.walletUtil = new WalletUtil()
    this.psffpp = new PSFFPP()
  }

  async run () {
    try {
      const { flags } = this.parse(IpfsPin)

      const server = this.walletUtil.getRestServer()

      const filename = `${__dirname.toString()}/../../.wallets/${
        flags.name
      }.json`

      await this.pinCid({flags, filename})

      return true
    } catch (err) {
      console.log('Error in run(): ', err)

      return false
    }
  }

  // Pin a CID. Use the selected wallet for payment.
  async pidCid(inObj = {}) {
    try {
      const {flags, filename} = inObj

      // Load the wallet file.
      const walletJSON = require(filename)
      const walletData = walletJSON.wallet

      const advancedConfig = this.walletUtil.getRestServer()
      this.bchWallet = new this.BchWallet(walletData.mnemonic, advancedConfig)

      // Wait for the wallet to initialize and retrieve UTXO data from the
      // blockchain.
      await this.bchWallet.walletInfoPromise
      await this.bchWallet.initialize()

      // Instantiate the PSFFPP library.
      const psffpp = new PSFFPP({wallet: this.bchWallet})

      // Get the cost to write 1MB to the PSFFPP network.
      const writePrice = await psffpp.getMcWritePrice()
      console.log('writePrice: ', writePrice)

      // Get the size of the file.

      // Upload the file to the IPFS node and get a CID.

      // Generate a PoB

      // Generate a Pin Claim

      return true
    } catch(err) {
      console.error('Error in pidCid()')
      throw err
    }
  }
}

IpfsPin.description = 'Pin a file to the PSFFPP network'

IpfsPin.flags = {
  cid: flags.string({
    char: 'f',
    description: 'filename to pin'
  }),

  name: flags.string({ char: 'n', description: 'Name of wallet' })
}

module.exports = IpfsPin
