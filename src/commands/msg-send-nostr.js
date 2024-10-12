/*
  Send an e2e encrypted message to another BCH address.
  Uses a public nostr post to store the encrypted message.
*/

// Global npm libraries
const { Command, flags } = require('@oclif/command')
const EncryptLib = require('bch-encrypt-lib/index')
const eccrypto = require('eccrypto-js')
const Write = require('p2wdb').Write
const fs = require('fs')

// Local libraries
const WalletUtil = require('../lib/wallet-util')
const PsffppUpload = require('./psffpp-upload.js')

class MsgSend extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.encryptLib = null // placeholder
    this.eccrypto = eccrypto
    this.Write = Write
    this.walletUtil = new WalletUtil()
    this.psffppUpload = new PsffppUpload()
  }

  async run () {
    try {
      const { flags } = this.parse(MsgSend)

      // Validate input flags
      this.validateFlags(flags)
      // const filename = `${__dirname.toString()}/../../.wallets/${
      //   flags.name
      // }.json`

      const result = await this.msgSend(flags)

      return result
    } catch (error) {
      console.log('Error in msg-send.js/run(): ', error)

      return 0
    }
  }

  // Primary function that orchistrates the workflow of sending an E2E encrypted
  // message to a BCH address.
  async msgSend (flags) {
    try {
      // Instatiate all the libraries orchestrated by this function.
      await this.instanceLibs(flags)

      const encryptedStr = await this.encryptMsgStr(flags)

      const eventId = await this.uploadToNostr({encryptedStr})
      console.log('Encrypted message uploaded to Nostr with post event ID: ', eventId)

      // Encrypt the message and upload it to the P2WDB.
      // const hash = await this.encryptAndUpload(flags)

      // Broadcast a PS001 signal on the blockchain, to signal the recipient
      // that they have a message waiting.
      // const txid = await this.sendMsgSignal(flags, hash)

      // return txid
    } catch (error) {
      console.log('Error in msgSend()')
      throw error
    }
  }

  // Upload the encrypted message to Nostr. Returns the event ID of the posted
  // message.
  async uploadToNostr(inObj = {}) {
    try {
      const {encryptedStr} = inObj

      // Generate a Nostr pub key from the private key of this wallet.
      const {privKeyBuf, nostrPubKey} = this.createNostrPubKey()
      console.log('nostrPubKey: ', nostrPubKey)

      const psfRelay = "wss://nostr-relay.psfoundation.info"

      // Generate a Nostr post.
      const eventTemplate = {
      	kind: 1,
      	created_at: Math.floor(Date.now() / 1000),
      	tags: [],
      	content: encryptedStr
      }

      // Sign the post
      const signedEvent = this.nostrToolsPure.finalizeEvent(eventTemplate, privKeyBuf)
      // console.log('signedEvent: ', signedEvent)
      const eventId = signedEvent.id

      // Connect to a relay.
      const relay = await this.nostrToolsRelay.Relay.connect(psfRelay)
      console.log(`connected to ${relay.url}`)

      // Publish the message to the relay.
      await relay.publish(signedEvent)

      // Close the connection to the relay.
      relay.close()

      return eventId
    } catch(err) {
      console.error('Error in uploadToNostr()')
      throw err
    }
  }

  // Generate a Nostr pubkey from the private key for this wallet.
  createNostrPubKey() {
    const wif = this.bchWallet.walletInfo.privateKey
    // console.log('wif: ', wif)

    // Extract the privaty key from the WIF, using this guide:
    // https://learnmeabitcoin.com/technical/keys/private-key/wif/
    const wifBuf = this.base58_to_binary(wif)
    const privKeyBuf = wifBuf.slice(1,33)

    // const privKeyHex = bytesToHex(privKeyBuf)

    const nostrPubKey = this.nostrToolsPure.getPublicKey(privKeyBuf)

    return {privKeyBuf, nostrPubKey}
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

    this.psffpp = await this.walletUtil.importPsffpp(this.bchWallet)

    // Instantiate the retry-queue library.
    let RetryQueue = await import('@chris.troutner/retry-queue')
    RetryQueue = RetryQueue.default
    const options = {
      concurrency: 1,
      attempts: 5,
      retryPeriod: 1000
    }
    this.retryQueue = new RetryQueue(options)

    // Instantiate the encryption library.
    this.encryptLib = new EncryptLib({
      bchjs: this.bchWallet.bchjs
    })

    // Instantiate the base58-js library
    const base58Lib = await import('base58-js')
    this.base58_to_binary = base58Lib.base58_to_binary

    // Instantiate the bytesToHex function.
    const noble = await import('@noble/hashes/utils')
    // console.log('noble: ', noble)
    this.bytesToHex = noble.bytesToHex

    // Instantiate the nostr-tools library
    this.nostrToolsPure = await import('nostr-tools/pure')
    this.nostrToolsRelay = await import('nostr-tools/relay')
    const WebSocketLib = await import('ws')
    // console.log('WebSocket: ', WebSocket)
    this.nostrToolsRelay.useWebSocketImplementation(WebSocketLib.WebSocket)

    return true
  }

  // Encrypt the message string. Returns a hexidecimal string representing
  // the encrypted message.
  async encryptMsgStr(flags) {
    try {
      const { bchAddress, message } = flags

      // Get public Key for reciever from the blockchain.
      // const pubKey = await this.walletService.getPubKey(bchAddress)
      const publicKey = await this.retryQueue.addToQueue(this.bchWallet.getPubKey, bchAddress)
      // const publicKey = pubKey.pubkey.publicKey
      console.log(`BCH Public Key: ${JSON.stringify(publicKey, null, 2)}`)

      // Encrypt the message using the recievers public key.
      const encryptedMsg = await this.encryptMsg(publicKey, message)
      console.log(`encryptedMsg: ${JSON.stringify(encryptedMsg, null, 2)}`)

      return encryptedMsg
    } catch(err) {
      console.error('Error in encryptMsgStr()')
      throw err
    }
  }

  // Encrypt the message and upload it to the P2WDB.
  async encryptAndUpload (flags) {
    const { bchAddress, message } = flags

    // Get public Key for reciever from the blockchain.
    // const pubKey = await this.walletService.getPubKey(bchAddress)
    const publicKey = await this.bchWallet.getPubKey(bchAddress)
    // const publicKey = pubKey.pubkey.publicKey
    console.log(`publicKey: ${JSON.stringify(publicKey, null, 2)}`)

    // Encrypt the message using the recievers public key.
    const encryptedMsg = await this.encryptMsg(publicKey, message)
    console.log(`encryptedMsg: ${JSON.stringify(encryptedMsg, null, 2)}`)

    // Upload the encrypted message to the P2WDB.
    const appId = 'psf-bch-wallet'
    const data = {
      now: new Date(),
      data: encryptedMsg
    }

    const path = `${__dirname.toString()}/../../ipfs-files`
    const fileName = 'msg.json'
    fs.writeFileSync(`${path}/${fileName}`, JSON.stringify(data, null, 2))

    const result = await this.psffppUpload.uploadFile({ path, fileName })
    const cid = result.cid
    console.log('cid: ', cid)

    // Generate a Pin Claim
    const pinObj = {
      cid,
      filename: fileName,
      fileSizeInMegabytes: 1
    }
    const { pobTxid, claimTxid } = await this.psffpp.createPinClaim(pinObj)
    console.log('pobTxid: ', pobTxid)
    console.log('claimTxid: ', claimTxid)

    // const result = await this.write.postEntry(data, appId)
    // console.log(`Data about P2WDB write: ${JSON.stringify(result, null, 2)}`)

    // const hash = result.hash

    // Return the hash used to uniquly identify this entry in the P2WDB.
    return cid
  }

  // Generate and broadcast a PS001 message signal.
  async sendMsgSignal (flags, hash) {
    const { bchAddress, subject } = flags

    // Wait a couple seconds to let the indexer update its UTXO state.
    await this.bchWallet.bchjs.Util.sleep(2000)

    // Update the UTXO store in the wallet.
    await this.bchWallet.getUtxos()

    // Sign Message
    const txHex = await this.signalMessage(hash, bchAddress, subject)

    // Broadcast Transaction
    const txidStr = await this.bchWallet.ar.sendTx(txHex)
    console.log(`Transaction ID : ${JSON.stringify(txidStr, null, 2)}`)

    return txidStr
  }

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
    const addr = flags.bchAddress
    const message = flags.message
    const name = flags.name
    const subject = flags.subject

    if (!addr || addr === '') {
      throw new Error('You must specify a bch address with the -a flag.')
    }
    if (!message || message === '') {
      throw new Error('You must specify the message to send with the -m flag.')
    }
    if (!subject || subject === '') {
      throw new Error('You must specify the message subject with the -s flag.')
    }
    if (!name || name === '') {
      throw new Error('You must specify a wallet with the -n flag.')
    }
    return true
  }
}

MsgSend.description = 'Send encrypted messages'

MsgSend.flags = {
  bchAddress: flags.string({ char: 'a', description: 'BCH Address' }),
  message: flags.string({ char: 'm', description: 'Message to send' }),
  subject: flags.string({ char: 's', description: 'Message Subject' }),
  name: flags.string({ char: 'n', description: 'Name of wallet' })
}

module.exports = MsgSend
