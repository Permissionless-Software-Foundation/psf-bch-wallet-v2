/*
  This command is run to prepare for a governance vote. It looks up the addresses
  holding all NFTs tied to a common group token. This list of addresses can
  then be used to air-drop voting tokens.
*/

// Public NPM libraries
// const Conf = require('conf')
// const { Pin, Write } = require('p2wdb')
const SlpWallet = require('minimal-slp-wallet')

// Local libraries
// const WalletUtil = require('../lib/wallet-util')

// Constants
const GROUP_ID = 'd89386b31c46ef977e6bae8e5a8b5770d02e9c3ee50fea5d4805490a5f17c5f3'

const { Command } = require('@oclif/command')

class VoteAddrs extends Command {
  constructor (argv, config) {
    super(argv, config)

    // Encapsulate dependencies.
    this.wallet = null // placeholder
  }

  async run () {
    try {
      this.wallet = await this.instanceWallet()

      const nfts = await this.getNftsFromGroup()
      console.log('nfts: ', nfts)

      const addrs = await this.getAddrs(nfts)
      console.log('addrs: ', addrs)

      console.log('Stringified addresses:')
      console.log(`${JSON.stringify(addrs)}`)

      return true
    } catch (err) {
      console.log('Error in vote-addrs.js/run(): ', err.message)

      return 0
    }
  }

  // This function expects an array of strings as input. Each element is expected
  // to be the Token ID of the an NFT. The address holding each NFT is looked up.
  // The array of addresses are filtered for duplicates, before being returned.
  async getAddrs (nfts) {
    try {
      const addrs = []

      for (let i = 0; i < nfts.length; i++) {
      // for (let i = 0; i < 1; i++) {
        const thisNft = nfts[i]

        const nftData = await this.wallet.getTokenData(thisNft, true)
        // console.log('nftData: ', nftData)
        const nftTxs = nftData.genesisData.txs
        // console.log('nftTxs: ', nftTxs)

        let mostRecentTx = ''

        // Loop through each of the transactions. Assuming that these txs
        // are arranged in descending order, with oldest first.
        for (let j = 0; j < nftTxs.length; j++) {
          const thisTx = nftTxs[j]
          // console.log('thisTx: ', thisTx)

          // Skip if this was a genesis transaction.
          if (thisTx.type.includes('GENESIS')) continue

          if (thisTx.type.includes('SEND')) {
            mostRecentTx = thisTx.txid
            break
          }
        }

        // console.log('mostRecentTx: ', mostRecentTx)

        const txDetails = await this.wallet.getTxData([mostRecentTx])
        // console.log(`txDetails: ${JSON.stringify(txDetails, null, 2)}`)

        const nftOwner = txDetails[0].vout[1].scriptPubKey.addresses[0]
        console.log(`NFT Owner address ${nftOwner} found for NFT ${thisNft}`)

        addrs.push(nftOwner)
      }

      return addrs
    } catch (err) {
      console.error('Error in getAddrs(): ', err)
      throw err
    }
  }

  // Retrieve a list of NFTs from the Group token that spawned them.
  async getNftsFromGroup () {
    try {
      const groupData = await this.wallet.getTokenData(GROUP_ID)
      // console.log('groupData: ', groupData)

      const nfts = groupData.genesisData.nfts

      return nfts
    } catch (err) {
      console.error('Error in getNftsFromGroup()')
      throw err
    }
  }

  // Instantiate the wallet library, which is used to interrogate the indexers
  // and retrieve the NFT info.
  async instanceWallet () {
    const wallet = new SlpWallet(undefined, { interface: 'consumer-api' })

    await wallet.walletInfoPromise

    return wallet
  }
}

VoteAddrs.description = `Collect Voting Addresses

This command is run to prepare for a governance vote. It looks up the addresses
holding all NFTs tied to a common group token. This list of addresses can
then be used to air-drop voting tokens.
`

// VoteAddrs.flags = {
//   name: flags.string({ char: 'n', description: 'Name of wallet' })
// }

module.exports = VoteAddrs
