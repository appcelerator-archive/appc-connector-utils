const test = require('tap').test
const modelMetadata = require('../data/modelsMetadata')
const modelMetadata1 = require('../data/modelMetadata1')
const config = require('../conf/local')
const utils = require('../../lib/utils/arrow')
const arrow = utils.createArrowAndConnector(config)
const server = arrow.server
const connector = arrow.connector
const library = require('../../lib')(connector, {})

test('test server, connector, and library', function (t) {
  t.ok(server)
  t.ok(connector)
  t.ok(library)
  t.end()
})

test('test createModels', function (t) {
  t.notOk(connector.models)
  const models = library.createModels(modelMetadata)
  t.same(models, connector.models)
  t.equal(Object.keys(models).length, 2)
  t.ok(models['People'])
  t.ok(models['Airlines'])
  connector.models = null
  t.end()
})

test('test createModels delayed attachment', function (t) {
  t.notOk(connector.models)
  const models = library.createModels(modelMetadata, {delayModelsAttachment: true})
  t.notOk(connector.models)
  t.equal(Object.keys(models).length, 2)
  t.ok(models['People'])
  t.ok(models['Airlines'])
  t.end()
})

test('test getConnector', function (t) {
  t.same(connector, library.getConnector())
  t.end()
})

test('test getConnectorConfig', function (t) {
  t.ok(library.getConnectorConfig())
  t.end()
})

test('test validateModelMetadata - ok', function (t) {
  const metadata = modelMetadata1['GoodMetadata']
  const result = library.utils.validateModelMetadata(metadata)
  t.same(result.value, metadata)
  t.end()
})

test('test validateModelMetadata - missing metadata', function (t) {
  const result = library.utils.validateModelMetadata()
  t.notOk(result)
  t.end()
})
