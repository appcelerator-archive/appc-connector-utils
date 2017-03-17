const Arrow = require('arrow')
const test = require('tap').test
const arrowUtils = require('../../lib/utils/arrow')(Arrow)
const arrowConfig = require('../conf/arrow')
const connectorFactory = require('../utils/connectorFactory')

var ENV
test('getConnectorStatic', t => {
  ENV = arrowUtils.getConnectorStatic(connectorFactory(), arrowConfig)

  t.ok(ENV.Arrow)
  t.ok(ENV.container)
  t.ok(ENV.connector)
  t.ok(ENV.container instanceof ENV.Arrow)
  t.ok(ENV.connector instanceof ENV.Arrow.Connector)

  t.end()
})
