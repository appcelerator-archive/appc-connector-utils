const test = require('tap').test
const modelMetadata = require('../data/modelMetadata1')

const metadataValidator = require('../../lib/utils/metadataValidator')

test('validateModelMetadata - missing metadata', function (t) {
  const result = metadataValidator.validateModelMetadata()
  t.notOk(result)
  t.end()
})

test('validateModelMetadata - ok', function (t) {
  const metadata = modelMetadata['GoodMetadata']
  const result = metadataValidator.validateModelMetadata(metadata)
  t.same(result.value, metadata)
  t.end()
})
