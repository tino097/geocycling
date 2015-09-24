var http = require('http');
var logger = require("./core/logger");

var Dispatcher = require('./dispatcher');
var WebServerProperties = require('./webserver-properties');

var args = process.argv.slice(2);

if (args[0] == null || args[1] == null) {
	logger.error("Missing command line arguments!. Please insert correct value [port] [config file path]");
	process.exit();
}

var port = args[0];
var webserverPropertiesPath = args[1];

logger.info("Initializing webserver properties...");

var webServerProperties = new WebServerProperties(webserverPropertiesPath);
webServerProperties.load();

logger.info("Finished initializing webserver properties");
logger.info("Initializing dispatcher...");

var dispatcher = new Dispatcher(webServerProperties);
dispatcher.init();

logger.info("Finsihed initializing dispatcher");

http.createServer(function(req, res) {
	dispatcher.dispatch(req, res);
}).listen(port);

logger.info('Server running at http://127.0.0.1:' + port + '/');
