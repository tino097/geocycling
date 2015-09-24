/**
 * 
 */

var logger = require("./core/logger");
var fs = require('fs');
var path = require('path');

var WebserverConstants = require('./webserver-constants');

/**
 * The constructor.
 * 
 * @param webServerProperties
 */
module.exports = function(webServerProperties) {
	this.webServerProperties = webServerProperties;

	/**
	 * 
	 */
	this.loadModule = function(portalProperties, moduleProperties) {
		var modulePath = this.webServerProperties.getModuleBasePath() + path.sep + moduleProperties.getName() + path.sep
				+ moduleProperties.getVersion() + path.sep + WebserverConstants.MODULE_FILE_NAME;

		if (fs.existsSync(modulePath)) {
			logger.info("Loading module, portalId=" + portalProperties.getId() + ", name=" + moduleProperties.getName() + ", version="
					+ moduleProperties.getVersion() + ", path=" + modulePath);

			// TODO verify if the module implements "the Module interface" (handleRequest function)
			var Module = require(modulePath);
			return new Module(this.webServerProperties, portalProperties, moduleProperties);
		}

		logger.error("Module does not exist, portalId=" + portalProperties.getId() + ", name=" + moduleProperties.getName() + ", version="
				+ moduleProperties.getVersion() + ", path=" + modulePath);
		return null;
	}
};