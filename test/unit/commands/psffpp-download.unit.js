/*
  Unit tests for the psffpp-download command
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const IpfsDownload = require('../../../src/commands/psffpp-download.js')

describe('#psffpp-download', () => {
  let uut
  let sandbox
  // let mockWallet

  // before(async () => {
  //   await walletCreate.createWallet(filename)
  // })

  beforeEach(async () => {
    sandbox = sinon.createSandbox()

    uut = new IpfsDownload()
    // mockWallet = new MockWallet()
  })

  afterEach(() => {
    sandbox.restore()
  })

  // after(async () => {
  //   await fs.rm(filename)
  // })

  describe('#validateFlags()', () => {
    it('validateFlags() should return true with valid input.', () => {
      const flags = {
        fileName: 'test123',
        cid: 'test'
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

    it('validateFlags() should throw error if cid is not supplied.', () => {
      try {
        const flags = {
          fileName: 'test123'
        }
        uut.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          'You must specify an IPFS CID with the -c flag.',
          'Expected error message.'
        )
      }
    })
  })

  describe('#downloadCid', () => {
    it('should issue a REST call to download the file', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.axios, 'post').resolves({
        data: {
          success: true,
          cid: 'fake-cid',
          size: '12345'
        }
      })

      const flags = {
        fileName: 'fake-filename'
      }

      const inObj = {
        server: 'fake-server',
        path: 'fake-path',
        flags
      }

      const result = await uut.downloadCid(inObj)

      assert.isObject(result)
      assert.property(result, 'success')
      assert.property(result, 'cid')
      assert.property(result, 'size')
    })

    it('should catch, report, and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut.axios, 'post').rejects(new Error('test error'))

        const flags = {
          fileName: 'fake-filename'
        }

        const inObj = {
          server: 'fake-server',
          path: 'fake-path',
          flags
        }

        await uut.downloadCid(inObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#run', async () => {
    it('should download the file and return true', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut, 'validateFlags').returns(true)
      sandbox.stub(uut, 'downloadCid').resolves()
      sandbox.stub(uut, 'parse').returns({})

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
