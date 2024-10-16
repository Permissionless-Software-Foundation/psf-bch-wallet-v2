/*
  Read e2e encrypted messages that have been posted to Nostr
*/

// Global npm libraries
const { Command, flags } = require('@oclif/command')
const EncryptLib = require('bch-encrypt-lib/index')
const Read = require('p2wdb').Read
// const axios = require('axios')

// Local libraries
// const WalletService = require('../lib/adapters/wallet-consumer')
const WalletUtil = require('../lib/wallet-util')

class MsgRead extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies
    this.encryptLib = null // placeholder
    this.Read = Read
    this.walletUtil = new WalletUtil()
  }

  async run () {
    try {
      const { flags } = this.parse(MsgRead)

      // Validate input flags
      this.validateFlags(flags)

      // Instatiate all the libraries orchestrated by this function.
      await this.instanceLibs(flags)

      const { sender, message } = await this.msgRead(flags)
      console.log(`Sender: ${sender}`)
      console.log(`Message:\n${message}`)

      return message
    } catch (error) {
      console.log('Error in msg-read.js/run(): ', error)

      return 0
    }
  }

  // Check for messages
  async msgRead (flags) {
    try {
      // Input validation
      if (!flags.name || typeof flags.name !== 'string') {
        throw new Error('Wallet name is required.')
      }

      const { txid } = flags

      // Get TX Data
      const txDataResult = await this.bchWallet.getTxData([txid])
      const txData = txDataResult[0]
      // console.log(`txData: ${JSON.stringify(txData, null, 2)}`)

      const sender = this.getSenderFromTx(txData)
      // console.log('sender: ', sender)

      // get the Nostr eventId from tx OP_RETURN
      const eventId = this.getEventIdFromTx(txData)
      console.log(`Nostr Event ID: ${eventId}`)

      // Get the encrypted message from Nostr and decrypt it.
      const message = await this.getAndDecrypt(eventId)

      return { sender, message }
    } catch (error) {
      console.log('Error in msgRead()')
      throw error
    }
  }

  // Given data on a TX, get the sender. This is assumed to be the address
  // behind the first input of the transaction.
  getSenderFromTx (txData) {
    const sender = txData.vin[0].address

    return sender
  }

  // Retrieve the encrypted data from a Nostr relay and decrypt it.
  async getAndDecrypt (eventId) {
    // Define the relay pool.
    const psf = 'wss://nostr-relay.psfoundation.info'
    const relays = [psf]
    const pool = this.RelayPool(relays)

    const nostrData = new Promise((resolve, reject) => {
      pool.on('open', relay => {
        relay.subscribe('REQ', { ids: [eventId] })
      })

      pool.on('eose', relay => {
        relay.close()
      })

      pool.on('event', (relay, subId, ev) => {
        resolve(ev)
      })
    })

    const event = await nostrData
    // console.log('event: ', event)

    const encryptedData = event.content

    // decrypt message
    const messageHex = await this.encryptLib.encryption.decryptFile(
      this.bchWallet.walletInfo.privateKey,
      encryptedData
    )
    // console.log(`messageHex: ${messageHex}`)

    const buf = Buffer.from(messageHex, 'hex')
    const decryptedMsg = buf.toString('utf8')
    // console.log('Message :', decryptedMsg)

    return decryptedMsg
  }

  // Instatiate the various libraries used by msgSend(). These libraries are
  // encasulated in the 'this' object.
  async instanceLibs (flags) {
    const { name } = flags

    // Instantiate minimal-slp-wallet.
    this.bchWallet = await this.walletUtil.instanceWallet(name)
    const walletData = this.bchWallet.walletInfo

    // Instantiate the bch-message-lib library.
    this.msgLib = this.walletUtil.instanceMsgLib(this.bchWallet)

    // Instatiate the P2WDB Write library.
    const p2wdbConfig = {
      wif: walletData.privateKey
    }
    this.read = new this.Read(p2wdbConfig)

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

    // Instantiate the Nostr library
    const Nostr = await import('nostr')
    this.RelayPool = Nostr.RelayPool

    return true
  }

  // decode and get transaction eventId from OP_RETURN
  getEventIdFromTx (txData) {
    try {
      // Input validation
      if (!txData) {
        throw new Error('txData object is required.')
      }
      let eventId = ''

      // Loop through all the vout entries in this transaction.
      for (let j = 0; j < txData.vout.length; j++) {
        // for (let j = 0; j < 5; j++) {
        const thisVout = txData.vout[j]
        // console.log(`thisVout: ${JSON.stringify(thisVout,null,2)}`)

        // Assembly code representation of the transaction.
        const asm = thisVout.scriptPubKey.asm
        // console.log(`asm: ${asm}`)

        // Decode the transactions assembly code.
        const msg = this.msgLib.memo.decodeTransaction(asm, '-21101')

        if (msg) {
          // Filter the code to see if it contains an IPFS eventId And Subject.
          const data = this.msgLib.memo.filterMSG(msg, 'MSG NOSTR')
          // console.log('data: ', data)
          if (data && data.hash) {
            eventId = data.hash
          }
        }
      }

      if (!eventId) {
        throw new Error('Message not found!')
      }

      return eventId
    } catch (error) {
      console.log('Error in getEventIdFromTx()')
      throw error
    }
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    // Exit if wallet not specified.
    const txid = flags.txid
    const name = flags.name

    if (!txid || txid === '') {
      throw new Error('You must specify a txid with the -t flag.')
    }
    if (!name || name === '') {
      throw new Error('You must specify a wallet with the -n flag.')
    }
    return true
  }
}

MsgRead.description = 'Read signed messages'

MsgRead.flags = {
  name: flags.string({ char: 'n', description: 'Name of wallet' }),
  txid: flags.string({ char: 't', description: 'Transaction ID' })
}

module.exports = MsgRead
