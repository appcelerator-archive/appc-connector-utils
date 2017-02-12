/**
 * this is your configuration file defaults.
 *
 * You can create additional configuration files to that the server will load based on your
 * environment.  For example, if you want to have specific settings for production which are different
 * than your local development environment, you can create a production.js and a local.js.  Any changes
 * in those files will overwrite changes to this file (a object merge is performed). By default, your
 * local.js file will not be commited to git or the registry.
 *
 * This is a JavaScript file (instead of JSON) so you can also perform logic in this file if needed.
 */
module.exports = {
	port: 4000,
	
	// these are your generated API keys.  They were generated uniquely when you created this project.
	// DO NOT SHARE these keys with other projects and be careful with these keys since they control
	// access to your API using the default configuration.  if you don't want two different keys for
	// production and test (not recommended), use the key 'apikey'.  To simulate running in production,
	// set the environment variable NODE_ENV to production before running such as:
	//
	// NODE_ENV=production appc run
	//
	// production key, this is the key that will be required when you are running in production
	apikey_production: 'rT5ZTvcQ6SqDk7QOUqMZfaAqnX94pZ0R',
	// development key, this is the key that will be required when you are testing non-production (such as locally)
	apikey_development: 'xu2MECiQqUAS5XihDVyXR1hGFmibS0Of',
	// preproduction key, this is the key that will be required when you are testing non-production (such as locally)
	apikey_preproduction: '6QiTl5O+i8QFLGFchaw1UP0plybuuqW8',

	// by default the authentication strategy is 'basic' which will use HTTP Basic Authorization where the
	// usename is the key and the password is blank.  the other option is 'apikey' where the value of the
	// APIKey header is the value of the key.  you can also set this to 'plugin' and define the key 'APIKeyAuthPlugin'
	// which points to a file or a module that implements the authentication strategy
	APIKeyAuthType: 'basic',

	// The number of milliseconds before timing out a request to the server.
	timeout: 120000,

	// logging configuration
	logLevel: 'debug', // Log level of the main logger.
	logging: {
		// location of the logs if enabled
		logdir: './logs',
		// turn on transaction logs
		transactionLogEnabled: true
	},

	// prefix to use for apis
	apiPrefix: '/api',

	// control the settings for the admin website
	admin: {
		// control whether the admin website is available
		enabled: true,
		// the prefix to the admin website
		prefix: '/arrow',
		// the prefix for the public apidocs website
		apiDocPrefix: '/apidoc',
		// if you set disableAuth, in production only your API docs will show up
		disableAuth: false,
		// if you set disableAPIDoc, your API docs will not show up (regardless of disableAuth)
		disableAPIDoc: false,
		// if you set disableDefault404, Arrow will not register a default 404 handler
		disableDefault404: false,
		// set to true to allow the admin website to be accessed in production. however, you will still need a
		// login unless disableAuth is false. if you set this to false, the admin website will not be enabled
		// when in production (still respects enabled above)
		enableAdminInProduction: false,
		// set the email addresses you want to be able to log in to the admin website
		validEmails: ["ptodorov@axway.com"],
		// set the organization ids you want to be able to log in to the admin website
		validOrgs: [100094705]
	},

	// you can generally leave this as-is since it is generated for each new project you created.
	session: {
		encryptionAlgorithm: 'aes256',
		encryptionKey: 'I27OfwlM8fDYVTE9r9Hy3Z5tCd2vqj7wNBq8tTV6ric=',
		signatureAlgorithm: 'sha512-drop256',
		signatureKey: 'Aiy+RhWdV0ptk07vaPncyvosHDLPxbE0CStVonlubwKTmAuYq22WqmQNrLXy8MBYYTjGk1+MDgRYn+OuM39iEw==',
		secret: 'p1HvshIZHJHn0IBsV9JI3R+o2g/6CFUq', // should be a large unguessable string
		duration: 86400000, // how long the session will stay valid in ms
		activeDuration: 300000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	},

	// if you want signed cookies, you can set this value. if you don't want signed cookies, remove or make null
	cookieSecret: 'G7iFwqmltyA4JC0DeI+/XlFX3qE+NuX1',

	// your connector configuration goes here
	connectors: {
		//If we skip this the connector is not found at all and we end up with plain arrow app when doing appc run
        'appc.ce-prop-02': {
            connector: 'appc.ce-prop-02',

			persistModels: true,
			persistSchema: true,
			bindModelMethods: true,
			//possible values: static / dynamic / both

			endpoints: 'static',
			schemaFileName: 'schema.json',

			//Contains the service that we connect to
			//We should have key with the name of the service as well with more config parameters
			connectTo: 'salesforce',
			salesforce: {
        		url: 'https://eu11.salesforce.com',
        		token: '00D0Y000000pN2e!AQQAQCPGO4Tmn9OmO3efrmE15MF79pBFR6WF664DVABwrORvtFr302hIWmlO_cY2bAhEd3TtZRelSoOAfDSk7egCj8JNQ8rg'
    		},

			apiDescriptionDir: 'test/express-server/public/json-swaggers',
			apiDescriptionFileName: 'salesforce.json',
			//apiDescriptionURL: 'http://localhost:3000/json-swaggers/salesforce.json',
			apiDescriptionURL: 'http://localhost:3000/json-swaggers/petstore.json',
			//apiDescriptionURL: 'http://localhost:3000/json-swaggers/twilio.json',
			
			elementMetadataDir: 'test/express-server/public/json-elements',
			elementMetadataFileName: 'salesforce.json',
			elementMetadataURL: 'http://localhost:3000/json-elements/salesforce.json',

			//This is used to decide to generate endpoints or not
            modelAutogen: true,

			//This one is for ???
            generateModelsFromSchema: true,
			handleResponse: function (err, response, body, next) {
				if (err) {
					return next(err);
				}

				// check if body exists first
				if (typeof body === 'object') {
					if (body.hasOwnProperty('success')) {
						if (!body.success) {
							return next(body);
						}
						if (body.hasOwnProperty('key') && body.key && body.hasOwnProperty(body.key)) {
							return next(null, body[body.key]);
						}
					}

					return next(null, body.hasOwnProperty('result') ? body.result : body);
				}

				/**
				 * On POST request the response status is 201 and the location of the created model is
				 * in response.headers.location.
				 */
				if (response.statusCode === 201 && response.headers) {
					/**
					 * Extracts created object's id from the location header.
					 * The location from response.headers.location follows the pattern {url}/{model}/{:id}
					 * and we have to parse the id of the newly created object in order to return it like response.
					 */
					var locationArr = response.headers.location.split('/');
					return next(null, { id: locationArr[locationArr.length - 1] });
				}

				return next(null, response);
			},
			/**
			 * Returns the primary key from a successful payload from your server.
			 */
			getPrimaryKey: function (result) {
				return result._id || result.id || result.Id || result.guid;
			}			
        }		
	},

	// the date and time format to be used for admin-ui. Default is 'yyyy:mm:dd, HH:MM:ss.l'
	// reference: https://github.com/felixge/node-dateformat
	dateTimeFormat: 'yyyy:mm:dd, HH:MM:ss.l'
};
