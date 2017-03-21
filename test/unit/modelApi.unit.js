const Arrow = require('arrow')
const test = require('tap').test
const modelMetadata2 = require('../data/modelMetadata2')
const modelMetadata3 = require('../data/modelMetadata3')
const arrowConfig = require('../conf/arrow')
const container = new Arrow(arrowConfig, true)
const connectorFactory = require('../utils/connectorFactory')
const connector = connectorFactory()

const modelApi = require('../../lib/model/api')(Arrow)

test('environment', t => {
  t.ok(container)
  t.ok(connector)
  t.end()
})

test('createFromMetadata - missing mandatory parameters', t => {
  t.throws(modelApi.createFromMetadata)
  t.end()
})

test('createFromMetadata - missing connector', t => {
  t.throws(createFromMetadata)
  t.end()

  function createFromMetadata () {
    modelApi.createFromMetadata(null, modelMetadata2)
  }
})

test('createFromMetadata - missing metadata', t => {
  t.throws(createFromMetadata)
  t.end()

  function createFromMetadata () {
    modelApi.createFromMetadata(connector)
  }
})

test('createFromMetadata', t => {
  const models = modelApi.createFromMetadata(connector, modelMetadata2)
  t.equal(Object.keys(models).length, 3)
  t.ok(models['People'])
  t.ok(models['Airlines'])
  t.ok(models['Call'])
  t.end()
})

test('createFromMetadata - check extra fields are set', t => {
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

  const name1Result = modelApi.getRootModelName(modelWithNamespace)
  t.equal(name1Result.nameOnly, 'myModel1')
  t.equal(name1Result.withNamespace, name1)

  const name2Result = modelApi.getRootModelName(modelWithoutNamespace)
  t.equal(name2Result.nameOnly, name2)
  t.equal(name2Result.withNamespace, name2)

  const name3Result = modelApi.getRootModelName(modelWithParent)
  t.equal(name3Result.nameOnly, name3)
  t.equal(name3Result.withNamespace, name3)

  const name4Result = modelApi.getRootModelName(modelWithParentNamespaced)
  t.equal(name4Result.nameOnly, 'myModel4')
  t.equal(name4Result.withNamespace, name4)

  const name5Result = modelApi.getRootModelName(modelWithParentNoName)
  t.equal(name5Result.nameOnly, 'myModel5')
  t.equal(name5Result.withNamespace, name5)

  t.throws(modelApi.getRootModelName.bind(null, wrongModel))

  t.end()
})

