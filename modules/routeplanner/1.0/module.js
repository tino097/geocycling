/**
 *
 */

var logger = require("../../../core/logger");
var http = require('http');
var getRequest = require('request');

var smartcyclingRequest = {
		"request_type" : "pretrip",
	  "num_routes" :3,
	  "lat_origin":0,
	  "long_origin":0,
	  "lat_destination":0,
	  "long_destination":0
};



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
		logger.warn("routeplanner module, moduleProperties=" + this.webServerProperties);
		var host = this.moduleProperties.getProperty("routeplanner_webservice_url").toString();
		var username=this.moduleProperties.getProperty("routeplanner_webservice_username").toString();
		var password=this.moduleProperties.getProperty("routeplanner_webservice_password").toString();
		var num_routes = this.moduleProperties.getProperty("num_routes");
		var reqBody = " ";
		console.log("received" + request);

		request.on('data', function(chunk){
			reqBody += chunk;
		});
		request.on('end', function(){
			var obj = JSON.parse(reqBody);

			smartcyclingRequest.num_routes = num_routes;
			smartcyclingRequest.lat_origin=obj.request_properties.lat_origin;
			smartcyclingRequest.long_origin=obj.request_properties.lon_origin;

			smartcyclingRequest.lat_destination=obj.request_properties.lat_destination;
			smartcyclingRequest.long_destination=obj.request_properties.lon_destination;

			console.log(JSON.stringify(smartcyclingRequest));
			getRequest({
						 url: host, //URL to hit
						 method: 'POST',
						 json	: smartcyclingRequest,
						 auth: {
						    'username': username,
						    'password': password,
						    'sendImmediately': true
						  },
							headers: {
	    				'Content-Type': 'application/json'
	  					}
						 //Lets post the following key/values as form
				 }, function(error, res, body){
						 var routeplannerResponse = {
						 	"module" : "geocoding-module",
						 	"status_code" : null,
						 	"status_message" : null,
						 	"response_properties":{
						 		"routes" : []
						 	}
						 }
							 if(!error && res.statusCode == 200){
								 	if(body === null || body === '[]' || body === undefined || body.length <= 2){
											routeplannerResponse.status_code = 400;
											routeplannerResponse.status_message = "No routes found";
											response.write(JSON.stringify(routeplannerResponse));
									}else{
										routeplannerResponse.status_code = 200;
										routeplannerResponse.status_message = "OK";
										for (var i = 0; i < body.routes.length; i++) {
													var temp = new Object();
													temp["coordinates"] = body.routes[i].coordinates;
													routeplannerResponse.response_properties.routes.push(temp);
										}
										response.write(JSON.stringify(routeplannerResponse));
									}

							 }else{
								 routeplannerResponse.status_code = 500;
								 routeplannerResponse.status_message = "Server Error!";
								 response.write(JSON.stringify(routeplannerResponse));
							 }
								response.end();
							});

		});
	}
};
