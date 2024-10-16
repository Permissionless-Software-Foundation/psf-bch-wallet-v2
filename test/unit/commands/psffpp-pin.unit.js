/*
  Unit tests for the psffpp-pin command
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const fs = require('fs')

// Local libraries
const IpfsPin = require('../../../src/commands/psffpp-pin.js')
const WalletCreate = require('../../../src/commands/wallet-create')
const walletCreate = new WalletCreate()
const MockWallet = require('../../mocks/msw-mock')

const walletFile = `${__dirname.toString()}/../../../.wallets/test123.json`

describe('#psffpp-pin', () => {
  let uut
  let sandbox
  let mockWallet

  before(async () => {
    await walletCreate.createWallet(walletFile)
  })

  beforeEach(async () => {
    sandbox = sinon.createSandbox()

    uut = new IpfsPin()
    mockWallet = new MockWallet()
  })

  afterEach(() => {
    sandbox.restore()
  })

  after(async () => {
    await fs.rm(walletFile, () => {})
  })

  describe('#validateFlags()', () => {
    it('validateFlags() should return true with valid input.', () => {
      const flags = {
        fileName: 'test123',
        name: 'test01'
      }

      assert.equal(uut.validateFlags(flags), true, 'return true')
    })

    it('validateFlags() should throw error if fileName is not supplied.', () => {
      try {
        const flags = {}
        uut.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          'You must specify a fileName',
          'Expected error message.'
        )
      }
    })

    it('validateFlags() should throw error if wallet name is not supplied.', () => {
      try {
        const flags = {
          fileName: 'test123'
        }

        uut.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          'You must specify a wallet with the -n flag.',
          'Expected error message.'
        )
      }
    })
  })

  describe('#getFileSize', () => {
    it('should return the size of a file', async () => {
      const filePath = `${__dirname.toString()}/psffpp-pin.unit.js`

      const result = await uut.getFileSize({ filePath })
      // console.log('result: ', result)

      assert.equal(result, 0.01)
    })

    it('should catch, report, and throw errors', async () => {
      try {
        await uut.getFileSize()

        assert.fail('Unexpted code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'argument must be of type string')
      }
    })
  })

  describe('#pinFile', () => {
    // it('should pin a file', async () => {
    //   // Mock dependencies and force desired code path.
    //   sandbox.stub(uut.walletUtil, 'instanceWallet').resolves(mockWallet)
    //   sandbox.stub(uut, 'getFileSize').resolves(0.08)
    //   sandbox.stub(uut, 'importPsffpp').resolves({
    //     getMcWritePrice: async () => 0.08335233,
    //     createPinClaim: async () => {
    //       return {
    //         pobTxid: 'fake-txid',
    //         claimTxid: 'fake-txid'
    //       }
    //     }
    //   })
    //   sandbox.stub(uut.psffppUpload, 'uploadFile').resolves({ cid: 'fake-cid' })
    //
    //   const inObj = {
    //     flags: {
    //       fileName: 'fake-file.txt',
    //       name: 'fake-wallet'
    //     },
    //     walletFile: 'test123.json'
    //   }
    //
    //   const result = await uut.pinFile(inObj)
    //   // console.log('result: ', result)
    //
    //   assert.isObject(result)
    //   assert.property(result, 'pobTxid')
    //   assert.property(result, 'claimTxid')
    // })

    it('should catch, report, and throw errors', async () => {
      try {
        await uut.pinFile()

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Cannot read')
      }
    })
  })

  describe('#importPsffpp', () => {
    it('should generate an instance of psffpp', async () => {
      const result = await uut.importPsffpp({ wallet: mockWallet })
      // console.log('result: ', result)

      assert.property(result, 'wallet')
      assert.property(result, 'currentWritePrice')
    })
  })

  describe('#run', async () => {
    it('should pin the file and return true', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut, 'validateFlags').returns(true)
      sandbox.stub(uut, 'pinFile').resolves()
      sandbox.stub(uut, 'parse').returns({ flags: { name: 'test123' } })

      const result = await uut.run()

      assert.equal(result, true)
    })

    it('should return false on error', async () => {
      // Force an error
      sandbox.stub(uut, 'parse').throws(new Error('test error'))

      const result = await uut.run()

      assert.equal(result, false)
    })
  })
})
