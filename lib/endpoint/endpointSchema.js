const Joi = require('joi')

const endpointSchema = Joi.object({

  /**
   * The logical name for grouping API endpoints.
   */
  group: Joi.string().required(),

  /**
   * Request path (e.g., ‘/api/user/:id’). Prefix paramaters with a colon (:).
   */
  path: Joi.string().required(),

  /**
   * HTTP verb (‘GET’, ‘POST’, ‘PUT’, or ‘DELETE’).
   */
  method: Joi.string().required(),

  /**
   * Description of the endpoint, which is used in the generation of the API endpoint documentation.
   */
  description: Joi.string(),

  /**
   * The model to use for the response. An API endpoint can only specify one model, but model’s can be composed of other models and fields.
   */
  model: Joi.string(),

  /**
   * Input parameters required to execute the API endpoint. This is an object of key-value pairs, where the key is the name of the parameter and the value is an object with the following properties:

    optional (Boolean): Determines if the parameter is optional (true) or required (false).
    type (String): the type of input parameter: ‘path’, ‘query’, or 'body'.
    description (String): used for generating API documentation.
    */
  parameters: Joi.object(),

  /**
   * Function that is called to execute the API endpoint’s logic. The function is passed a request object, response object and next() method. Use this function to make programmatic calls to your model’s methods for reading or writing data and to do other things related to the custom business logic of your API endpoint including making calls to other node modules that your API endpoint requires. You should always make sure that your action function calls the next function regardless if the result is a success or an error.
   */
  action: Joi.func().required(),

  /**
   * The response model for the API. This should only be used if your request and response models are different.
   */
  response: Joi.object(),

  /**
   * Determines whether to generate API documentation (true) or not (false). Default is true.
   */
  documented: Joi.boolean(),

  /**
   * A string used as the property name when your API endpoint returns an array. By default, the plural value is the plural of the model name. For example, if your model is named car, the default plural would be cars.
   */
  plural: Joi.string(),

  /**
   * One or more Arrow Blocks to be executed before the request. Blocks are referenced by their name property. If you want to execute multiple blocks, you should specify them as an array of block names. If multiple blocks are specified, they are executed in the order specified.
   */
  singular: Joi.string(),

  /**
   * One or more Arrow Blocks to be executed before the request. Blocks are referenced by their name property. If you want to execute multiple blocks, you should specify them as an array of block names. If multiple blocks are specified, they are executed in the order specified.
   */
  before: Joi.array(),

  /**
   * One or more Arrow Blocks to be executed after the request. Blocks are referenced by their name property. If you want to execute multiple blocks, you should specify them as an array of block names. If multiple blocks are specified, they are executed in the order specified.
   */
  after: Joi.array()

})

module.exports = endpointSchema
