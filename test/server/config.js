module.exports = {
	port: 4000,
	timeout: 120000,
	logLevel: 'debug', // Log level of the main logger.
	logging: {
		logdir: './logs',
		transactionLogEnabled: true
	},
	apiPrefix: '/api',
	dateTimeFormat: 'yyyy:mm:dd, HH:MM:ss.l',
	admin: {
		enabled: true,
		prefix: '/arrow',
		apiDocPrefix: '/apidoc',
		disableAuth: true,
		disableAPIDoc: false,
		disableDefault404: false,
		enableAdminInProduction: false,
	},

	session: {},
	connectors: {
        'testConn': {
            connector: 'testConn',
            modelAutogen: true,
            generateModelsFromSchema: true,
        }		
	}
};
