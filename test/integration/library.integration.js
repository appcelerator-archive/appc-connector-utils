const Arrow = require('arrow')
const test = require('tap').test
const modelMetadata1 = require('../data/modelMetadata1')
const modelMetadata2 = require('../data/modelMetadata2')
const callsMetadata = require('../data/callsMetadata')
const arrowConfig = require('../conf/arrow')
const container = new Arrow(arrowConfig, true)
const connectorFactory = require('../utils/connectorFactory')
const connector = connectorFactory()
const library = require('../../lib')(Arrow, connector)

test('server, connector, and library', t => {
  t.ok(container)
  t.ok(connector)
  t.ok(library)
  t.end()
})

test('createModels', t => {
  t.notOk(connector.models)
  const models = library.load.models(modelMetadata2)
  t.same(models, connector.models)
  t.equal(Object.keys(models).length, 3)
  t.ok(models['appc.test/People'])
  t.ok(models['appc.test/Airlines'])
  t.ok(models['appc.test/Call'])
  connector.models = null
  t.end()
})

test('createModels delayed attachment', t => {
  t.notOk(connector.models)
  const models = library.load.models(modelMetadata2, {delayModelsAttachment: true})
  t.notOk(connector.models)
  t.equal(Object.keys(models).length, 3)
  t.ok(models['appc.test/People'])
  t.ok(models['appc.test/Airlines'])
  t.ok(models['appc.test/Call'])
  t.end()
})

test('createModels - missing metadata', t => {
  t.throws(library.load.models)
  t.end()
})

test('getConnector', t => {
  t.same(connector, library.context.connector)
  t.end()
})

test('getConnectorConfig', t => {
  t.ok(library.context.config)
  t.end()
})

test('validateModelMetadata - ok', t => {
  const metadata = modelMetadata1['GoodMetadata']
  const result = library.validate.modelMetadata(metadata)
  t.same(result.value, metadata)
  t.end()
})

test('validateModelMetadata - missing metadata', t => {
  const result = library.validate.modelMetadata()
  t.notOk(result)
  t.end()
})

test('getRootModelName', t => {
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

  const name1Result = library.getRootModelName(modelWithNamespace)
  t.equal(name1Result.nameOnly, 'myModel1')
  t.equal(name1Result.withNamespace, name1)

  const name2Result = library.getRootModelName(modelWithoutNamespace)
  t.equal(name2Result.nameOnly, name2)
  t.equal(name2Result.withNamespace, name2)

  const name3Result = library.getRootModelName(modelWithParent)
  t.equal(name3Result.nameOnly, name3)
  t.equal(name3Result.withNamespace, name3)

  const name4Result = library.getRootModelName(modelWithParentNamespaced)
  t.equal(name4Result.nameOnly, 'myModel4')
  t.equal(name4Result.withNamespace, name4)

  const name5Result = library.getRootModelName(modelWithParentNoName)
  t.equal(name5Result.nameOnly, 'myModel5')
  t.equal(name5Result.withNamespace, name5)

  t.throws(library.getRootModelName.bind(null, wrongModel))

  t.end()
})

test('createInstanceFromModel', t => {
  // Simulate model creation and get it
  library.load.models(modelMetadata2)
  const model = connector.models['appc.test/Call']

  // Use it to create instance from this Model
  var result = library.create.modelInstance(model, callsMetadata[0], 'sid')
  t.ok(result)
  t.equal(typeof result, 'object')
  t.end()
})

test('createCollectionFromModel', t => {
  // Simulate model creation and get it
  library.load.models(modelMetadata2)
  const model = connector.models['appc.test/Call']

  // Use it to create collection from this Model
  const result = library.create.arrowCollection(model, callsMetadata, 'sid')
  t.ok(result)
  t.ok(result instanceof Array)
  t.ok(result.length === 3)
  t.end()
})
