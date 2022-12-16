/*
  This command creates a multisig wallet. It takes address-public-key pairs
  generated from the multisig-collect-keys command as input. It uses that
  data to construct a P2SH multisig wallet. The wallet object is displayed
  on the command line as the output.
*/

// Public NPM libraries
// const Conf = require('conf')
// const { Pin, Write } = require('p2wdb')
const SlpWallet = require('minimal-slp-wallet')
const bitcore = require('bitcore-lib-cash')

// Local libraries
const WalletUtil = require('../lib/wallet-util')

const { Command, flags } = require('@oclif/command')

class MultisigCreateWallet extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.walletUtil = new WalletUtil()
    // this.conf = new Conf()
    // this.Pin = Pin
    // this.Write = Write
    this.wallet = null // placeholder
  }

  async run () {
    try {
      const { flags } = this.parse(MultisigCreateWallet)

      // Validate input flags
      this.validateFlags(flags)

      // Instantiate the Write library.
      await this.instantiateWallet(flags)

      // Optimize the wallet
      // await this.optimizeWallet(flags)
      const walletObj = await this.createMultisigWallet(flags)
      console.log(`wallet object: ${JSON.stringify(walletObj, null, 2)}`)

      return true
    } catch (err) {
      console.log('Error in p2wdb-pin.js/run(): ', err.message)

      return 0
    }
  }

  // Generate a P2SH multisignature wallet from the public keys of the NFT holders.
  async createMultisigWallet (flags) {
    try {
      const pubKeyPairs = JSON.parse(flags.pairs)
      const pubKeys = []

      // Isolate just an array of public keys.
      for (let i = 0; i < pubKeyPairs.length; i++) {
        const thisPair = pubKeyPairs[i]

        pubKeys.push(thisPair.pubKey)
      }

      // Determine the number of signers. It's 50% + 1
      const requiredSigners = Math.floor(pubKeys.length / 2) + 1

      // Multisig Address
      const msAddr = new bitcore.Address(pubKeys, requiredSigners)

      // Locking Script in hex representation.
      const scriptHex = new bitcore.Script(msAddr).toHex()

      const walletObj = {
        address: msAddr.toString(),
        scriptHex,
        publicKeys: pubKeys,
        requiredSigners
      }

      return walletObj
    } catch (err) {
      console.error('Error in createMultisigWallet()')
      throw err
    }
  }

  // Optimize the wallet by consolidating the UTXOs.
  async optimizeWallet (flags) {
    try {
      const result = await this.wallet.optimize()
      console.log('Wallet has been optimized. Output object: ', result)

      return result
    } catch (err) {
      console.error('Error in optimizeWallet()')
      throw err
    }
  }

  // Instatiate the wallet library.
  async instantiateWallet (flags) {
    try {
      // // Instantiate the wallet.
      // this.wallet = await this.walletUtil.instanceWallet(flags.name)
      // // console.log(`wallet.walletInfo: ${JSON.stringify(wallet.walletInfo, null, 2)}`)
      //
      // return true

      const wallet = new SlpWallet(undefined, { interface: 'consumer-api' })

      await wallet.walletInfoPromise

      this.wallet = wallet

      return wallet
    } catch (err) {
      console.error('Error in instantiateWrite()')
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    // Exit if wallet not specified.
    const pairs = flags.pairs
    if (!pairs || pairs === '') {
      throw new Error('You must specify a JSON string of key pairs with the -p flag.')
    }

    return true
  }
}

MultisigCreateWallet.description = `Create a multisig wallet

This command creates a multisig wallet. As input, it takes address-public-key
pairs generated from the multisig-collect-keys command. It uses that
data to construct a P2SH multisig wallet. The wallet object is displayed
on the command line as the output.
`

MultisigCreateWallet.flags = {
  pairs: flags.string({ char: 'p', description: 'JSON string of address-key pairs' })
}

module.exports = MultisigCreateWallet
