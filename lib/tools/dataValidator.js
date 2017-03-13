const Joi = require('joi')

module.exports = {
  validate: validate
}

/**
 * Validates data based on Joi schemas
 *
 * @param {Object} data the data to be validated
 * @param {Object} schema the object schema specified in Joi against which data is validated
 */
function validate (data, schema) {
  if (!data || !schema) {
    throw new Error('Trying to validate without passing data and schema')
  }
  return Joi.validate(data, schema)
}
