/*
  This command sends a copy of an unsigned multisignature transaction to each
  holder of an NFT. They can then issue the multisign-sign command to sign their
  input and send the signature back to the originator.

  The input to this command comes from previous commands:
  - The -p flag for 'pairs' is expected to be the stringified JSON data output
    by the multisig-collect-keys command.
  - The -t flag 'transaction' is execpted to be the stringified JSON data output
    by the multisig-create-tx command.

  This command leverages the P2WDB to send an e2ee message to each holder of
  an NFT.
*/

// Global npm libraries
const { Command, flags } = require('@oclif/command')
const EncryptLib = require('bch-encrypt-lib/index')
const eccrypto = require('eccrypto-js')
const Write = require('p2wdb').Write

// Local libraries
const WalletUtil = require('../lib/wallet-util')

class MultisigSendTx extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.encryptLib = null // placeholder
    this.eccrypto = eccrypto
    this.Write = Write
    this.walletUtil = new WalletUtil()
  }

  async run () {
    try {
      const { flags } = this.parse(MultisigSendTx)

      // Validate input flags
      this.validateFlags(flags)
      // const filename = `${__dirname.toString()}/../../.wallets/${
      //   flags.name
      // }.json`

      const result = await this.msgSend(flags)

      return result
    } catch (error) {
      console.log('Error in multisig-send-tx.js/run(): ', error)

      return 0
    }
  }

  // Primary function that orchistrates the workflow of sending an E2E encrypted
  // message to a BCH address.
  async msgSend (flags) {
    try {
      // Instatiate all the libraries orchestrated by this function.
      await this.instanceLibs(flags)

      // Encrypt the message and upload it to the P2WDB.
      await this.encryptAndUpload(flags)

      // Broadcast a PS001 signal on the blockchain, to signal the recipient
      // that they have a message waiting.
      // const txid = await this.sendMsgSignal(flags, hash)

      return true
    } catch (error) {
      console.log('Error in msgSend()')
      throw error
    }
  }

  // Instatiate the various libraries used by msgSend(). These libraries are
  // encasulated in the 'this' object.
  async instanceLibs (flags) {
    const { name } = flags

    // Instantiate minimal-slp-wallet.
    this.bchWallet = await this.walletUtil.instanceWallet(name)
    // const walletData = this.bchWallet.walletInfo

    // Instantiate the bch-message-lib library.
    this.msgLib = this.walletUtil.instanceMsgLib(this.bchWallet)

    // Get the selected P2WDB server URL
    const serverURL = this.walletUtil.getP2wdbServer()

    // Instatiate the P2WDB Write library.
    const p2wdbConfig = {
      bchWallet: this.bchWallet,
      serverURL
    }
    this.write = new this.Write(p2wdbConfig)

    // Instantiate the encryption library.
    this.encryptLib = new EncryptLib({
      bchjs: this.bchWallet.bchjs
    })

    return true
  }

  // Encrypt the message and upload it to the P2WDB.
  async encryptAndUpload (flags) {
    // const { bchAddress, message } = flags
    const { pairs, tx } = flags

    const addrPairs = JSON.parse(pairs)

    // Loop over each of the address/pubkey pairs.
    for (let i = 0; i < addrPairs.length; i++) {
      const thisPair = addrPairs[i]

      const publicKey = thisPair.pubKey
      const bchAddress = thisPair.addr
      console.log(`Sending multisig TX to ${bchAddress} and encrypting with public key ${publicKey}`)

      // Encrypt the message using the recievers public key.
      const encryptedMsg = await this.encryptMsg(publicKey, tx)
      console.log(`encryptedMsg: ${JSON.stringify(encryptedMsg, null, 2)}`)

      // Upload the encrypted message to the P2WDB.
      const appId = 'psf-bch-wallet'
      const data = {
        now: new Date(),
        data: encryptedMsg
      }

      const result = await this.write.postEntry(data, appId)
      console.log(`Data about P2WDB write: ${JSON.stringify(result, null, 2)}`)

      const hash = result.hash

      // Wait a couple seconds to let the indexer update its UTXO state.
      await this.bchWallet.bchjs.Util.sleep(2000)

      // Update the UTXO store in the wallet.
      await this.bchWallet.getUtxos()

      const subject = 'multisig-tx'

      // Sign Message
      const txHex = await this.signalMessage(hash, bchAddress, subject)

      // Broadcast Transaction
      const txidStr = await this.bchWallet.ar.sendTx(txHex)
      console.log(`Transaction ID : ${JSON.stringify(txidStr, null, 2)}`)
      console.log(' ')
    }

    return true
  }

  // Generate and broadcast a PS001 message signal.
  // async sendMsgSignal (flags, hash) {
  //   const { bchAddress, subject } = flags
  //
  //   // Wait a couple seconds to let the indexer update its UTXO state.
  //   await this.bchWallet.bchjs.Util.sleep(2000)
  //
  //   // Update the UTXO store in the wallet.
  //   await this.bchWallet.getUtxos()
  //
  //   // Sign Message
  //   const txHex = await this.signalMessage(hash, bchAddress, subject)
  //
  //   // Broadcast Transaction
  //   const txidStr = await this.bchWallet.ar.sendTx(txHex)
  //   console.log(`Transaction ID : ${JSON.stringify(txidStr, null, 2)}`)
  //
  //   return txidStr
  // }

  // Encrypt a message using encryptLib
  async encryptMsg (pubKey, msg) {
    try {
      // Input validation
      if (!pubKey || typeof pubKey !== 'string') {
        throw new Error('pubKey must be a string')
      }
      if (!msg || typeof msg !== 'string') {
        throw new Error('msg must be a string')
      }

      const buff = Buffer.from(msg)
      const hex = buff.toString('hex')

      const encryptedStr = await this.encryptLib.encryption.encryptFile(
        pubKey,
        hex
      )
      // console.log(`encryptedStr: ${JSON.stringify(encryptedStr, null, 2)}`)

      return encryptedStr
    } catch (error) {
      console.log('Error in encryptMsg()')
      throw error
    }
  }

  // Generate a PS001 signal message to write to the blockchain.
  // https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps001-media-sharing.md
  async signalMessage (hash, bchAddress, subject) {
    try {
      if (!hash || typeof hash !== 'string') {
        throw new Error('hash must be a string')
      }
      if (!bchAddress || typeof bchAddress !== 'string') {
        throw new Error('bchAddress must be a string')
      }
      if (!subject || typeof subject !== 'string') {
        throw new Error('subject must be a string')
      }

      // Generate the hex transaction containing the PS001 message signal.
      const txHex = await this.msgLib.memo.writeMsgSignal(
        hash,
        [bchAddress],
        subject
      )

      if (!txHex) {
        throw new Error('Could not build a hex transaction')
      }

      return txHex
    } catch (error) {
      console.log('Error in signalMessage')
      throw error
    }
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    // Exit if wallet not specified.
    const name = flags.name
    const pairs = flags.pairs
    const tx = flags.tx

    if (!name || name === '') {
      throw new Error('You must specify a wallet with the -n flag.')
    }

    if (!pairs || pairs === '') {
      throw new Error('You must specify the address/pubKey pairs with the -p flag.')
    }

    if (!tx || tx === '') {
      throw new Error('You must specify the transaction to send with the -t flag.')
    }

    return true
  }
}

MultisigSendTx.description = 'Send unsigned multisig transaction to NFT holders'

MultisigSendTx.flags = {
  pairs: flags.string({ char: 'p', description: 'Address pairs generated by multisig-collect-keys' }),
  tx: flags.string({ char: 't', description: 'Transaction generated by multisig-create-tx' }),
  name: flags.string({ char: 'n', description: 'Name of wallet to pay for messages' })
}

module.exports = MultisigSendTx
