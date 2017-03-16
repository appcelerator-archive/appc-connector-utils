const Arrow = require('arrow')
const test = require('tap').test
const modelMetadata2 = require('../data/modelMetadata2')
const modelMetadata3 = require('../data/modelMetadata3')
const arrowConfig = require('../conf/arrow')
const connectorConfig = require('../conf/connector')

const arrow = new Arrow(arrowConfig, true)
console.log(arrow)
const DEFAULT_CONNECTOR_NAME = 'appc.test'
const DEFAULT_CONNECTOR_METADATA = {
  name: DEFAULT_CONNECTOR_NAME,
  connect: function () { },
  create: function (Model, value, callback) { }
}
const Connector = Arrow.Connector.extend(DEFAULT_CONNECTOR_METADATA)
const connector = new Connector(connectorConfig)

// const connector = arrow.getConnector('appc.test')
// const arrow = utils.createArrowWithConnector({arrowConfig, connectorConfig})
// const connector = arrow.connector

const modelApi = require('../../lib/model/api')(Arrow)

test('createFromMetadata - missing mandatory parameters', function (t) {
  t.throws(modelApi.createFromMetadata)
  t.end()
})

test('createFromMetadata - missing connector', function (t) {
  t.throws(createFromMetadata)
  t.end()

  function createFromMetadata () {
    modelApi.createFromMetadata(null, modelMetadata2)
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
  const models = modelApi.createFromMetadata(connector, modelMetadata2)
  t.equal(Object.keys(models).length, 2)
  t.ok(models['People'])
  t.ok(models['Airlines'])
  t.end()
})

test('createFromMetadata - check extra fields are set', function (t) {
  const models = modelApi.createFromMetadata(connector, modelMetadata3)
  t.equal(Object.keys(models).length, 1)
  const createdModel = models['Airlines']
  t.ok(createdModel)
  t.ok(createdModel.actions)
  t.ok(createdModel.autogen)
  t.same(createdModel.connector, connector)
  t.ok(createdModel.disabledActions)
  t.ok(createdModel.fields.Name)
  t.ok(createdModel.generated)
  t.ok(createdModel.metadata.primarykey)
  t.equal(createdModel.name, 'appc.test/Airlines')
  t.ok(createdModel.plural)
  t.ok(createdModel.singular)
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

  const name1Result = modelApi.getParentModelName(modelWithNamespace)
  t.equal(name1Result.nameOnly, 'myModel1')
  t.equal(name1Result.withNamespace, name1)

  const name2Result = modelApi.getParentModelName(modelWithoutNamespace)
  t.equal(name2Result.nameOnly, name2)
  t.equal(name2Result.withNamespace, name2)

  const name3Result = modelApi.getParentModelName(modelWithParent)
  t.equal(name3Result.nameOnly, name3)
  t.equal(name3Result.withNamespace, name3)

  const name4Result = modelApi.getParentModelName(modelWithParentNamespaced)
  t.equal(name4Result.nameOnly, 'myModel4')
  t.equal(name4Result.withNamespace, name4)

  const name5Result = modelApi.getParentModelName(modelWithParentNoName)
  t.equal(name5Result.nameOnly, 'myModel5')
  t.equal(name5Result.withNamespace, name5)

  t.throws(modelApi.getParentModelName.bind(null, wrongModel))

  t.end()
})

