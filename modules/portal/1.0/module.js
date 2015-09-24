/**
 * TODO
 */

var logger = require("../../../core/logger");
var fs = require("fs");
var mime = require('mime')
/**
 * The constructor.
 *
 * @param webServerProperties
 * @param moduleProperties
 */
module.exports = function(webServerProperties, portalProperties, moduleProperties) {
	this.webServerProperties = webServerProperties;
	this.portalProperties = portalProperties;
	this.moduleProperties = moduleProperties;

	this.isPortalModule = function() {
		return true;
	}

	/**
	 * TODO
	 */
	this.handleRequest = function(request, response) {
		// TODO add proper logging
		logger.warn("portal module, moduleProperties=" + this.webServerProperties);

		var url = require("url").parse(request.url, true);
		var filename = url.pathname.indexOf("/", url.pathname.length - 1) !== -1 ? this.moduleProperties.getProperty("main_html_file")
				: this.moduleProperties.getProperty("public_dir") + url.pathname.replace(this.portalProperties.getId(), "");


		fs.readFile(filename, function(err, file) {

			if (err) {
				logger.error("Unable to locate file, file=" + filename);
				response.writeHeader(500);
				return;
			}
			response.writeHeader(200, {
				"Content-Type" : mime.lookup(filename)
			});
			response.write(file, "binary");
			response.end();
		});


	}
};
