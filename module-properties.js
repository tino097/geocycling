
module.exports = function(moduleProperties) {
	this.moduleProperties = moduleProperties;
	
	this.getName = function() {
		return (this.moduleProperties != null ? this.moduleProperties.name: null);
	}

	this.getVersion = function() {
		return (this.moduleProperties != null ? this.moduleProperties.version: null);
	}
	
	this.getResource = function() {
		return (this.moduleProperties != null ? this.moduleProperties.resource: null);
	}

	this.getMethod = function() {
		return (this.moduleProperties != null ? this.moduleProperties.method: null);
	}
	
	this.getProperty = function(property) {
		return (this.moduleProperties != null && this.moduleProperties.properties != null ? this.moduleProperties.properties[property]: null);
	}
	
	this.getProperties = function() {
		return (this.moduleProperties != null ? this.moduleProperties.properties: null);
	}
};