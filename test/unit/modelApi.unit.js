const test = require('tap').test
const modelMetadata2 = require('../data/modelMetadata2')
const modelMetadata3 = require('../data/modelMetadata3')
const arrowConfig = require('../conf/arrow')
const connectorConfig = require('../conf/connector')
const utils = require('../../lib/utils/arrow')
const arrow = utils.createArrowWithConnector({arrowConfig, connectorConfig})
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
