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

  const name1Result = arrowUtils.getParentModelName(modelWithNamespace)
  t.equal(name1Result.nameOnly, 'myModel1')
  t.equal(name1Result.withNamespace, name1)

  const name2Result = arrowUtils.getParentModelName(modelWithoutNamespace)
  t.equal(name2Result.nameOnly, name2)
  t.equal(name2Result.withNamespace, name2)

  const name3Result = arrowUtils.getParentModelName(modelWithParent)
  t.equal(name3Result.nameOnly, name3)
  t.equal(name3Result.withNamespace, name3)

  const name4Result = arrowUtils.getParentModelName(modelWithParentNamespaced)
  t.equal(name4Result.nameOnly, 'myModel4')
  t.equal(name4Result.withNamespace, name4)

  const name5Result = arrowUtils.getParentModelName(modelWithParentNoName)
  t.equal(name5Result.nameOnly, 'myModel5')
  t.equal(name5Result.withNamespace, name5)

  t.throws(arrowUtils.getParentModelName.bind(null, wrongModel))

  t.end()
})

// TODO Fix this test
// test('createArrowAndStartHTTPServer', function (t) {
//   arrowUtils.createArrowAndStartHTTPServer(config, (server) => {
//     t.ok(server)
//     t.end()
//   })
// })

