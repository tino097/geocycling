/**
 * The "webserver-properties.js" class takes care of loading the webserver and portal properties into memory.
 */

var logger = require("./core/logger");
var fs = require('fs');

var PortalProperties = require('./portal-properties');

/**
 * The constructor.
 * 
 * @param filePath the path to the "webserver-<application>.properties" file.
 */
module.exports = function(filePath) {
	this.filePath = filePath;
	this.properties = null;
	this.portals = [];

	/**
	 * Loads the "webserver-<application>.properties" file into memory.
	 */
	this.load = function() {
		try {
			logger.info("Reading the config file: " + this.filePath);
			this.properties = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));

			if (this.properties.portals != null && this.properties.portals.length > 0) {
				for (var i = 0; i < this.properties.portals.length; i++) {
					var portalProperties = new PortalProperties(this.properties.portals[i]);
					portalProperties.load();

					this.portals.push(portalProperties);
				}
			}
		} catch (e) {
			logger.error(e);

			if (e.code == 'ENOENT')
				logger.error("Config file not found! Please specify correct congig file path.");

			process.exit(0);
		}
	}

	/**
	 * Returns the log file path.
	 */
	this.getLogFile = function() {
		return (this.properties != null ? this.properties.log_file : null);
	}

	/**
	 * Returns the list of portals as defined in the loaded "webserver-<application>.properties" file.
	 */
	this.getPortals = function() {
		return this.portals;
	}

	/**
	 * Returns the base path of the server modules.
	 */
	this.getModuleBasePath = function() {
		return (this.properties != null ? this.properties.module_base_path : null);
	}
};