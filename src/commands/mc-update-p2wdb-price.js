/*
  This is pretty complex script. Ultimately what it achieves is that it generates
  a multisig transaction for updating the P2WDB write price.

  This script looks up the price of BCH and the PSF token, and calculates the
  amount of PSF tokens in $0.01 USD. This is the target price for writing an
  entry to the P2WDB (P2WDB.com).

  This command calls the mc-collect-keys command and uses the output to generate
  a multisig transaction. It then send that transaction to each of the Minting
  Council NFT holders. If successfully broadcast, that transaction will update
  all instances of the P2WDB to target a new write price.
*/

// Public NPM libraries
// const SlpWallet = require('minimal-slp-wallet')
const bitcore = require('bitcore-lib-cash')
const EncryptLib = require('bch-encrypt-lib/index')
const { Write, Pin } = require('p2wdb')
const Conf = require('conf')

// Local libraries
const WalletUtil = require('../lib/wallet-util')
const MCCollectKeys = require('./mc-collect-keys')

// CONSTANTS
// CID should resolve to a JSON document on IPFS that the P2WDB will use to
// validate the last price.
// const CID = 'bafybeicvlcwv3flrwa4egmroyicvghevi6uzbd56drmoerjeguu4ikpnhe'
// WRITE_PRICE_ADDR is the address that is used by the P2WDB to determine the write price.
// const WRITE_PRICE_ADDR = 'bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d'
const WRITE_PRICE_ADDR = 'bitcoincash:qrwe6kxhvu47ve6jvgrf2d93w0q38av7s5xm9xfehr' // test address

// Update this constant to reflect the Group token uses to generate the Minting
// Council NFTs.
const GROUP_ID = 'd89386b31c46ef977e6bae8e5a8b5770d02e9c3ee50fea5d4805490a5f17c5f3'

const { Command, flags } = require('@oclif/command')

class MCUpdateP2wdbPrice extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.walletUtil = new WalletUtil()
    this.wallet = null // placeholder
    this.bchjs = null // placeholder
    this.mcCollectKeys = new MCCollectKeys()
    this.Write = Write
    this.Pin = Pin
    this.msgLib = null // placeholder
    this.write = null // placeholder
    this.pin = null // placeholder
    this.encryptLib = null // placeholder
    this.bitcore = bitcore
    this.conf = new Conf()
  }

  async run () {
    try {
      const { flags } = this.parse(MCUpdateP2wdbPrice)

      // Validate input flags
      this.validateFlags(flags)

      // Instantiate the Write library.
      await this.instantiateWallet(flags)

      // Look up the public keys for MC NFT holders.
      const keys = await this.getPublicKeys()
      console.log('keys: ', keys)

      // Generate a 50% + 1 multisig wallet.
      const walletObj = this.createMultisigWallet(keys)
      console.log(`wallet object: ${JSON.stringify(walletObj)}`)

      // Instatiate all the libraries orchestrated by this function.
      await this.instanceLibs()

      // Generate update data, upload to IPFS, and get a CID
      const cid = await this.uploadDataToIpfs({keys, walletObj})
      // const cid = 'bafybeiea2rb73y6gkiaxaljpv2hj5hfczpibl634kj6flbz575j4t4bswa'

      // Generate an update transaction with the update CID
      const updateTxid = await this.writeCidToBlockchain(cid)

      // // Placeholder for CID to put in OP_RETURN.
      // const cid = CID

      // // Generate a transaction for updating the P2WDB write cost.
      const txObj = await this.createMultisigTx(walletObj, updateTxid)
      console.log('txObj: ', txObj)

      // Send the encrypted TX to each NFT holder
      await this.encryptAndUpload(txObj, keys, flags)

      return true
    } catch (err) {
      console.log('Error in mc-update-p2wdb-price.js/run(): ', err.message)

      return 0
    }
  }

  // Generate update data, upload to IPFS, and get a CID as per the PS009 spec.
  async uploadDataToIpfs (inObj = {}) {
    try {
      const { keys, walletObj } = inObj

      const updateTxData = {
        groupId: GROUP_ID,
        keys,
        walletObj,
        multisigAddr: walletObj.address
      }
      // console.log('updateTxData: ', updateTxData)

      // Upload the data to the P2WDB.
      const p2wdbResult = await this.write.postEntry(updateTxData, 'p2wdb-update')
      // console.log('p2wdbResult: ', p2wdbResult)
      const zcid = p2wdbResult.hash

      // Get a CID from the P2WDB zCID
      const cid = await this.pin.json(zcid)
      console.log('cid: ', cid)

      // Pin the CID with the pinning cluster
      const pinResult = await this.pin.cid(cid)
      // console.log('pinResult: ', pinResult)

      return cid
    } catch (err) {
      console.error('Error in uploadDataToIpfs(): ', err.message)
      throw err
    }
  }

  // This function expects an IPFS CID as input. This is the output of the
  // uploadDataToIpfs() function. It writes the update data CID to the BCH
  // blockchain, and generates the transaction that the Minting Council will
  // approve.
  async writeCidToBlockchain (cid) {
    try {
      const now = new Date()
      const opReturnObj = {
        cid,
        ts: now.getTime()
      }
      const opReturnStr = JSON.stringify(opReturnObj)

      const receivers = [{
        address: WRITE_PRICE_ADDR,
        amountSat: 546
      }]

      await this.wallet.initialize()

      const txid = await this.wallet.sendOpReturn(opReturnStr, '', receivers)
      console.log('txid: ', txid)

      return txid
    } catch (err) {
      console.error('Error in writeCidToBlockchain(): ', err)
      throw err
    }
  }

  // Encrypt the message and upload it to the P2WDB.
  async encryptAndUpload (txObj, keys, flags) {
    console.log('txObj: ', txObj)
    console.log('keys: ', keys)

    // Loop over each of the address/pubkey pairs.
    for (let i = 0; i < keys.length; i++) {
      const thisPair = keys[i]

      const publicKey = thisPair.pubKey
      const bchAddress = thisPair.addr
      console.log(`Sending multisig TX to ${bchAddress} and encrypting with public key ${publicKey}`)

      let message = ''
      if (flags.message) message = flags.message

      // Encrypt the message using the recievers public key.
      const encryptedMsg = await this.encryptMsg(publicKey, JSON.stringify({ message, txObj }, null, 2))
      // console.log(`encryptedMsg: ${JSON.stringify(encryptedMsg, null, 2)}`)

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
      await this.wallet.bchjs.Util.sleep(2000)

      // Update the UTXO store in the wallet.
      await this.wallet.getUtxos()

      let subject = 'multisig-tx'
      if (flags.subject) {
        subject = flags.subject
      }

      // Sign Message
      const txHex = await this.signalMessage(hash, bchAddress, subject)

      // Broadcast Transaction
      const txidStr = await this.wallet.broadcast(txHex)
      console.log(`Transaction ID: ${JSON.stringify(txidStr, null, 2)}`)
      console.log(' ')
    }

    return true
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

  // Instatiate the various libraries used by msgSend(). These libraries are
  // encasulated in the 'this' object.
  async instanceLibs () {
    // Instantiate the bch-message-lib library.
    this.msgLib = this.walletUtil.instanceMsgLib(this.wallet)

    // Get the selected P2WDB server URL
    const serverURL = this.walletUtil.getP2wdbServer()

    const pinServer = this.walletUtil.getPinServer()

    // Instatiate the P2WDB Write and Pin libraries.
    const p2wdbConfig = {
      bchWallet: this.wallet,
      serverURL,
      pinServer
    }
    this.write = new this.Write(p2wdbConfig)
    this.pin = new this.Pin(p2wdbConfig)

    // Instantiate the encryption library.
    this.encryptLib = new EncryptLib({
      bchjs: this.wallet.bchjs
    })

    return true
  }

  // Create a transaction to spend 1000 sats from the multisig wallet.
  async createMultisigTx (walletObj, updateTxid) {
    try {
      // Timestamp
      let ts = new Date()
      ts = ts.getTime()

      // console.log('cid: ', cid)
      // console.log('ts: ', ts)

      // Generate the OP_RETURN data
      const script = [
        this.bchjs.Script.opcodes.OP_RETURN,
        Buffer.from('APPROVE'),
        Buffer.from(updateTxid)
      ]

      // Compile the script array into a bitcoin-compliant hex encoded string.
      const opReturnData = this.bchjs.Script.encode(script)

      // Bitcore can mess up the OP_RETURN. So I generate an initial tx with
      // bch-js and pass the hex to Bitcore.
      const txBuilder = new this.bchjs.TransactionBuilder()
      txBuilder.addOutput(opReturnData, 0)
      const tx = txBuilder.transaction.buildIncomplete()
      const hex = tx.toHex()

      // const walletObj = JSON.parse(flags.wallet)
      // console.log('walletObj: ', walletObj)

      // Get UTXO information for the multisig address.
      const utxos = await this.wallet.getUtxos(walletObj.address)
      // console.log('utxos: ', utxos)

      // Grab the biggest BCH UTXO for spending.
      const utxoToSpend = this.wallet.bchjs.Utxo.findBiggestUtxo(utxos.bchUtxos)
      // console.log('utxoToSpend: ', utxoToSpend)

      // Repackage the UTXO for bitcore-lib-cash
      const utxo = {
        txid: utxoToSpend.tx_hash,
        outputIndex: utxoToSpend.tx_pos,
        address: walletObj.address,
        script: walletObj.scriptHex,
        satoshis: utxoToSpend.value
      }

      const chosenAddr = WRITE_PRICE_ADDR

      // Generate a multisignature transaction.
      const multisigTx = new this.bitcore.Transaction(hex)
        .from(utxo, walletObj.publicKeys, walletObj.requiredSigners)
        // Send 1000 sats back to the chosen address.
        .to(chosenAddr, 1000)
        .feePerByte(3)
        // Send change back to the multisig address
        .change(walletObj.address)

      // This unsigned transaction object is sent to all participants.
      const unsignedTxObj = multisigTx.toObject()

      // Save the unsigned tx object so that it can be used in the mc-finish command.
      this.conf.set('p2wdb-price-tx', unsignedTxObj)

      return unsignedTxObj
    } catch (err) {
      console.error('Error in createMultisigTx(): ', err)
      throw err
    }
  }

  // Generate a P2SH multisignature wallet from the public keys of the NFT holders.
  createMultisigWallet (keyPairs) {
    try {
      // Isolate just an array of public keys.
      const pubKeys = []
      for (let i = 0; i < keyPairs.length; i++) {
        const thisPair = keyPairs[i]

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

  // Retrieve the public keys for all MC NFT holders.
  async getPublicKeys () {
    try {
      // Collect the NFT token IDs.
      await this.mcCollectKeys.instanceWallet()
      const nfts = await this.mcCollectKeys.getNftsFromGroup()
      // console.log('nfts: ', nfts)

      // Get the address holding each NFT.
      const addrs = await this.mcCollectKeys.getAddrs(nfts)
      // console.log('addrs: ', addrs)

      // Get the public keys for each address holding an NFT.
      const { keys } = await this.mcCollectKeys.findKeys(addrs, nfts)

      return keys
    } catch (err) {
      console.error('Error in getPublicKeys()')
      throw err
    }
  }

  // Instatiate the wallet library.
  async instantiateWallet (flags) {
    try {
      const { name } = flags

      // Instantiate the wallet.
      // const wallet = new SlpWallet(undefined, { interface: 'consumer-api' })

      // Instantiate minimal-slp-wallet.
      const wallet = await this.walletUtil.instanceWallet(name)

      // await wallet.walletInfoPromise
      // await wallet.initialize()

      this.wallet = wallet
      this.bchjs = wallet.bchjs

      return wallet
    } catch (err) {
      console.error('Error in instantiateWrite()')
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags (flags) {
    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === '') {
      throw new Error('You must specify a wallet with the -n flag.')
    }

    return true
  }
}

MCUpdateP2wdbPrice.description = `Generate a multsig TX for the Minting Council to update the price of P2WDB writes.

This command creates a multisig wallet. As input, it takes address-public-key
pairs generated from the multisig-collect-keys command. It uses that
data to construct a P2SH multisig wallet. The wallet object is displayed
on the command line as the output.

This is a long-running command. It does the following:
- It calls the mc-collect-keys commands to get the public keys for each holder of the Minting Council NFT.
- It generates a multisignature wallet from those keys requiring 50% + 1 signers.
- It generates a transaction for spending from the wallet, attaching an OP_RETURN to update the P2WDB write price.
- It sends the unsigned transaction to each member of the Minting Council.
`

MCUpdateP2wdbPrice.flags = {
  name: flags.string({ char: 'n', description: 'Name of wallet paying to send messages to NFT holders' }),
  subject: flags.string({ char: 's', description: 'Subject of e2ee message.' }),
  message: flags.string({ char: 'm', description: 'Message attached to transaction sent to each NFT holder.' })
}

module.exports = MCUpdateP2wdbPrice
