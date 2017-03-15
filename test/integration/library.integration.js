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

test('getParentModelName', function (t) {
  const name1 = 'appc.test/myModel1'
  const name2 = 'myModel2'
  const name3 = 'myModel3'
  const name4 = 'appc.test/myModel4'
  const name5 = 'appc.test/myModel5'

  const modelWithNamespace = {name: name1}
  const modelWithoutNamespace = {name: name2}
  const modelWithParent = {_parent: {name: name3}}
  const modelWithParentNamespaced = {_parent: {name: name4}}
  const modelWithParentNoName = {name: name5, _parent: {}}
  const wrongModel = {}

  const name1Result = library.utils.getParentModelName(modelWithNamespace)
  t.equal(name1Result.nameOnly, 'myModel1')
  t.equal(name1Result.withNamespace, name1)

  const name2Result = library.utils.getParentModelName(modelWithoutNamespace)
  t.equal(name2Result.nameOnly, name2)
  t.equal(name2Result.withNamespace, name2)

  const name3Result = library.utils.getParentModelName(modelWithParent)
  t.equal(name3Result.nameOnly, name3)
  t.equal(name3Result.withNamespace, name3)

  const name4Result = library.utils.getParentModelName(modelWithParentNamespaced)
  t.equal(name4Result.nameOnly, 'myModel4')
  t.equal(name4Result.withNamespace, name4)

  const name5Result = library.utils.getParentModelName(modelWithParentNoName)
  t.equal(name5Result.nameOnly, 'myModel5')
  t.equal(name5Result.withNamespace, name5)

  t.throws(library.utils.getParentModelName.bind(null, wrongModel))

  t.end()
})
