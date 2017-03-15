const test = require('tap').test
const arrowConfig = require('../conf/arrow')
const connectorConfig = require('../conf/connector')

const arrowUtils = require('../../lib/utils/arrow')

test('createArrow', function (t) {
  const arrow = arrowUtils.createArrow({arrowConfig, connectorConfig})
  t.ok(arrow)
  t.end()
})

test('createArrowWithConnector', function (t) {
  const arrow = arrowUtils.createArrowWithConnector({arrowConfig, connectorConfig})
  t.ok(arrow.server)
  t.ok(arrow.connector)
  t.end()
})

test('createArrowWithConnectorAndConnect', function (t) {
  const arrow = arrowUtils.createArrowWithConnectorAndConnect({arrowConfig, connectorConfig})
  t.ok(arrow.server)
  t.ok(arrow.connector)
  t.end()
})

test('createArrowWithHTTPServer', (t) => {
  arrowUtils.createArrowWithHTTPServer(arrowConfig, (server) => {
    t.ok(server)
    t.end()
  })
})

