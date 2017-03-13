const test = require('tap').test
const modelMetadata = require('../data/modelsMetadata')
const config = require('../conf/local')
const utils = require('../../lib/utils/arrow')
const arrow = utils.createArrowAndConnector(config)
const connector = arrow.connector

const modelApi = require('../../lib/model/api')

test('createFromMetadata - missing mandatory parameters', function (t) {
  t.throws(modelApi.createFromMetadata)
  t.end()
})

test('createFromMetadata - missing connector', function (t) {
  t.throws(createFromMetadata)
  t.end()

  function createFromMetadata () {
    modelApi.createFromMetadata(null, modelMetadata)
  }
})

test('createFromMetadata - missing metadata', function (t) {
  t.throws(createFromMetadata)
  t.end()

  function createFromMetadata () {
    modelApi.createFromMetadata(connector)
  }
})

test('createFromMetadata', function (t) {
  const models = modelApi.createFromMetadata(connector, modelMetadata)
  t.equal(Object.keys(models).length, 2)
  t.ok(models['People'])
  t.ok(models['Airlines'])
  t.end()
})
