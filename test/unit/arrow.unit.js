const test = require('tap').test
const config = require('../conf/local')

const arrowUtils = require('../../lib/utils/arrow')

test('createArrow', function (t) {
  const arrow = arrowUtils.createArrow(config)
  t.ok(arrow)
  t.end()
})

test('createArrowAndConnector', function (t) {
  const arrow = arrowUtils.createArrowAndConnector(config)
  t.ok(arrow.server)
  t.ok(arrow.connector)
  t.end()
})

test('createConnector', function (t) {
  const connector = arrowUtils.createConnector(config)
  t.ok(connector)
  t.end()
})

// TODO Fix this test
// test('createArrowAndStartHTTPServer', function (t) {
//   arrowUtils.createArrowAndStartHTTPServer(config, (server) => {
//     t.ok(server)
//     t.end()
//   })
// })

