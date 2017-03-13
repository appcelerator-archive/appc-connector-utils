const Joi = require('joi')

/**
 * Is this too specific for the swagger case?
 */
const modelMethodsSchema = Joi.object().pattern(/.*/, Joi.object({
  json: Joi.boolean(),
  generated: Joi.boolean(),
  verb: Joi.string(),
  url: Joi.string(),
  path: Joi.string(),
  autogen: Joi.boolean(),
  meta: Joi.object(),
  params: Joi.array()
}))

const modelFieldsSchema = Joi.object().pattern(/.*/, Joi.object({

  /**
   * Used if the model field name is different than the field name in the connector’s model or the underlying data source for the field name. For example, if my model field is first_name and the column in a MySQL database is fname, the value of the name property should be 'fname'.
   */
  name: Joi.string(),

  /**
   * The field primitive type plus others (e.g., ‘string’, 'number', 'boolean', 'object', 'array', 'date'). Type can be any valid JavaScript primitive type. Type can be specified as a string (e.g., ‘string’) or by the type class (e.g., String).
   */
  type: Joi.string(),

  /**
   * The description of the field (used for API documentation).
   */
  description: Joi.string(),

  /**
   * Either true or false. If true the field will be readonly and any attempt to write the field value will fail.
   */
  readonly: Joi.boolean(),

  /**
   * The max length of the field (specified as an integer)
   */
  maxlength: Joi.number(),

  /**
   * Specifies whether the field is required. The default value is false.
   */
  required: Joi.boolean(),

  /**
   * The default value for the field.
   */
  default: Joi.any(),

  /**
   * Model name of the field property. This is either the logical name of a custom model or a connector model name in the form connector/model_name (e.g., appc.mysql/employee)
   */
  model: Joi.string(),

  /**
   * A function or regular expression that validates the value of the field. The function is passed the data to validate and should return either null or undefined if the validation succeeds. Any other return value means the validation failed, and the return value will be used in the exception message. If a regular expression is used, it should evaluate to either true or false.
   */
  validator: Joi.func(),

  /**
   * This property should be specified and set to true if you are defining a custom field. A custom field is one that does not exist in the underlying data source for the connector you specified.
   */
  custom: Joi.boolean(),

  /**
   * A function used to set the value of a property that will be sent to the client. This property is useful if you want to define a custom field where the value is derived.
   */
  get: Joi.func(),

  /**
   * A function used to set the value of a property that will be sent to the connector.
   */
  set: Joi.func(),

  /**
   * Not in the documentation
   */
  originalType: Joi.string(),

  /**
   * Not in the docs. Duplicated with required. May be for removal.
   */
  optional: Joi.boolean()
}))

const modelSchema = Joi.object({

  /**
   * An object that represents the model’s schema define as key-value pairs. The key is the name of the field and the value is the fields object. See modelFieldsSchema for details.
   */
  fields: modelFieldsSchema,

  /**
   * Connector to which the model is bound (string). Each model can only have one connector. Connectors are responsible for reading and writing data from/to their data source.
   */
  connector: Joi.object(),

  /**
   * Used to determine whether to generate API endpoints directly from the model. The default value is true. If the endpoint is auto-generated, you do not need to create an API endpoint definition.
   */
  autogen: Joi.boolean().required(), // optional ?!

  /**
   * Used to provide connector specific configuration (e.g., mapping the model to a specific database table for the MySQL connector or defining the join properties).
   */
  metadata: Joi.object(),

  /**
   * An array of data operations supported by the model. The valid values are: ‘create’, ‘read’, ‘update’, and ‘delete’. If this property is missing all are supported by the model. If it is empty no endpoints are generated for the model.
   */
  actions: Joi.array(),

  /**
   * Determines whether to generate API documentation (true) or not (false). Default is true.
   */
  documented: Joi.boolean(),

  /**
   * A string used as the property name when your API endpoint returns an array. By default, the plural value is the plural of the model name. For example, if your model is named car, the default plural would be cars. Note: this value can be set on an API or a model.
   */
  plural: Joi.string(),

  /**
   * A string used as the property name when your API endpoint returns a single record. By default, the singular value is the name of the model. Note: this value can be set on an API or a model.
   */
  singular: Joi.string(),

  /**
   * One or more blocks to be executed before the request. Blocks are referenced by their name property. If you want to execute multiple blocks, you should specify them as an array of block names. If multiple blocks are specified, they are executed in the order specified.
   */
  before: Joi.array(),

  /**
   * One or more blocks to be executed after the request. Blocks are referenced by their name property. If you want to execute multiple blocks, you should specify them as an array of block names. If multiple blocks are specified, they are executed in the order specified.
   */
  after: Joi.array(),

  /**
   * Bellow are fields that are not in the documentation
   */
  name: Joi.string().required(),
  generated: Joi.boolean().required(),
  methods: modelMethodsSchema,
  disabledActions: Joi.array(),
  visible: Joi.boolean()
})

module.exports = modelSchema
