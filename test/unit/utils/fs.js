'use strict'

const tap = require('tap')
const test = tap.test
const sinon = require('sinon')
const fsFile = require('../../../lib/utils/fs')
const fs = require('fs')

const sandbox = sinon.sandbox

tap.beforeEach((done) => {
  sandbox.create()
  done()
})

tap.afterEach((done) => {
  sandbox.restore()
  done()
})

test(' cleanDir without exist dir', t => {
  const fsExistsSyncStub = sandbox.stub(fs, 'existsSync').callsFake((dir) => {
    return false
  })

  fsFile.cleanDir()
  t.ok(fsExistsSyncStub.called)
  t.end()
})

test(' cleanDir with exist dir and txt files', t => {
  const fsExistsSyncStub = sandbox.stub(fs, 'existsSync').callsFake((dir) => {
    return true
  })
  const fsreaddirSyncStub = sandbox.stub(fs, 'readdirSync').callsFake((dir) => {
    return ['firstName.txt', 'secondName.txt']
  })

  fsFile.cleanDir('someDir')
  t.ok(fsExistsSyncStub.called)
  t.ok(fsreaddirSyncStub.calledOnce)
  t.end()
})

test(' cleanDir with exist dir and js files ', t => {
  const fsExistsSyncStub = sandbox.stub(fs, 'existsSync').callsFake((dir) => {
    return true
  })
  const fsReaddirSyncStub = sandbox.stub(fs, 'readdirSync').callsFake((dir) => {
    return ['firstName.js', 'secondName.js']
  })

  const fsUnlinkSyncStub = sandbox.stub(fs, 'unlinkSync').callsFake((dir) => {
    return undefined
  })

  fsFile.cleanDir('someDir')
  t.ok(fsExistsSyncStub.called)
  t.ok(fsReaddirSyncStub.calledOnce)
  t.ok(fsUnlinkSyncStub.calledTwice)
  t.end()
})
