var logger = require("./core/logger");
var fs = require('fs');

var ModuleProperties = require('./module-properties');

module.exports = function(filePath) {
	this.filePath = filePath;
	this.properties = null;
	this.modules = [];

	this.load = function() {
		try {
			logger.info("Reading the config file: " + this.filePath);
			this.properties = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
			
			if(this.properties.modules != null && this.properties.modules.length > 0) {
				for(var i = 0; i < this.properties.modules.length; i++) {
					var moduleProperties = new ModuleProperties(this.properties.modules[i]);
					this.modules.push(moduleProperties);
				}
			}
		} catch (e) {
			logger.error(e);
			
			if (e.code == 'ENOENT')
				logger.error("Config file not found! Please specify correct congig file path.");
			
			process.exit(0);
		}
	}

	this.getId = function() {
		return (this.properties != null ? this.properties.id : null);
	}

	this.getModules = function() {
		return this.modules;
	}
};