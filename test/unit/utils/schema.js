const utilsSchema = require('../../../lib/utils/schema')
const modelMetadata2 = require('../../data/modelMetadata2')
const test = require('tap').test
const Arrow = require('arrow')
const arrowConfig = require('../../conf/arrow')
const container = new Arrow(arrowConfig, true)
const connectorFactory = require('../../utils/connectorFactory')
const connector = connectorFactory()
const library = require('../../../lib')(Arrow, connector)
const schema = {
  findAll: 'retrieve'
}

test('server, connector, and library', t => {
  t.ok(container)
  t.ok(connector)
  t.ok(library)
  t.end()
})

test('correct modelActions', (t) => {
  const models = library.load.models(modelMetadata2)
  const modelNames = Object.keys(models)
  const model = models[modelNames[0]]
  utilsSchema.modelActions(model, schema)

  t.ok(model.disabledActions.length)
  t.ok(!(model.disabledActions['findAll']))

  t.end()
})
