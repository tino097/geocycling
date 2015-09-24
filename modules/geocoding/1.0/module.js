/**
 *
 */

var logger = require("../../../core/logger");
var http = require('http');
var getRequest = require('request');


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

	/**
	 *
	 */
	this.handleRequest = function(request, response) {
			//logger.warn("geocoding module, moduleProperties=" + this.webServerProperties);

			var url = require("url").parse(request.url, true);
			var host = this.moduleProperties.getProperty("geocoding_webservice_url").toString();
		  var reqBody = " ";

			var geocodingModuleResponese = {
				"module" : "geocoding-module",
				"status_code" : null,
				"status_message" : null,
				"response_properties":{
						"address" : null,
						"lat" : null,
						"lon" : null
				}
			};

			request.on('data', function(chunk){
				reqBody += chunk;
			});
			request.on('end', function(){
				var obj = JSON.parse(reqBody);
        host += obj.request_properties.address;
				logger.info("HOST:" + host);
				var data = " ";
				getRequest({
							 url: host+"?format=json&place=Netherlands", //URL to hit
							 method: 'GET'
							 //Lets post the following key/values as form
					 }, function(error, res, body){
						 	// console.log(body);
							if(!error && res.statusCode == 200){
								if(body===null || body === '[]' || body === undefined || body.length <= 2){
									logger.warn("Empty response received " + body);
									//response.writeHead(404, {'Content-Type': 'application/json'});
									geocodingModuleResponese.status_code = 404;
									response.write(JSON.stringify(geocodingModuleResponese));
								}else{
									var jsonBody = JSON.parse(body);
									response.writeHead(200, {'Content-Type': 'application/json'});
									geocodingModuleResponese.status_code = "200";
								  geocodingModuleResponese.status_message = "OK";
								  geocodingModuleResponese.response_properties.address = jsonBody[0].display_name;
								  geocodingModuleResponese.response_properties.lat = jsonBody[0].lat;
								  geocodingModuleResponese.response_properties.lon = jsonBody[0].lon;
									response.write(JSON.stringify(geocodingModuleResponese));
								}
							}else {
								logger.error("Internal server error " + error);
								response.writeHead(500, {'Content-Type': 'application/json'});
								geocodingModuleResponese.status_code = "500";
							 	geocodingModuleResponese.status_message = "Internal server error";
								response.write(JSON.stringify(geocodingModuleResponese));
							}
								response.end();
						}

				 );
			});
	 }
};
