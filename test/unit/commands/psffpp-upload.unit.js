/*
  Unit tests for the psffpp-upload command
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const IpfsUpload = require('../../../src/commands/psffpp-upload.js')

describe('#psffpp-upload', () => {
  let uut
  let sandbox
  // let mockWallet

  // before(async () => {
  //   await walletCreate.createWallet(filename)
  // })

  beforeEach(async () => {
    sandbox = sinon.createSandbox()

    uut = new IpfsUpload()
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
        fileName: 'test123'
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
  })

  describe('#uploadFile', () => {
    it('should issue a REST API call to upload a file', async () => {
      // Mock dependencies and force desired code path.
      sandbox.stub(uut.axios, 'post').resolves({
        data: {
          success: true,
          cid: 'fake-cid'
        }
      })

      const inObj = {
        path: 'fake-path',
        fileName: 'fake-filename',
        server: 'fake-server'
      }

      const result = await uut.uploadFile(inObj)

      assert.isObject(result)
      assert.property(result, 'success')
      assert.property(result, 'cid')
    })

    it('should catch, report, and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut.axios, 'post').rejects(new Error('test error'))

        const inObj = {
          path: 'fake-path',
          fileName: 'fake-filename',
          server: 'fake-server'
        }

        await uut.uploadFile(inObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#run', async () => {
    it('should upload the file and return true', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut, 'validateFlags').returns(true)
      sandbox.stub(uut, 'uploadFile').resolves()
      sandbox.stub(uut, 'parse').returns({ flags: { fileName: 'fake-filename' } })

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
