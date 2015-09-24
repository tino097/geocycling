/**
 * TODO
 */
var logger = require("./core/logger");
var httpDispatcher = require('httpdispatcher');

var WebserverConstants = require('./webserver-constants');
var ModuleLoader = require('./module-loader');

/**
 * Constructor
 *
 * @param webServerProperties
 */
module.exports = function(webServerProperties) {
	this.webServerProperties = webServerProperties;
	this.moduleLoader = new ModuleLoader(this.webServerProperties);
	this.resources = {
		GET : [],
		POST : []
	};

	/**
	 * TODO
	 */
	this.init = function() {
	//	httpDispatcher.setStatic('public');

		var portals = this.webServerProperties.getPortals();

		if (portals != null && portals.length > 0) {
			for (var i = 0; i < portals.length; i++) {
				var portalProperties = portals[i];
				var modules = portalProperties.getModules();

				logger.info("Processing portal, portalId=" + portalProperties.getId() + ", modules=" + (modules != null ? modules.length : null));

				if (modules != null && modules.length > 0) {
					for (var j = 0; j < modules.length; j++) {
						var moduleProperties = modules[j];
						var resource = "/" + portalProperties.getId() + moduleProperties.getResource();

						logger.info("Processing module, portalId=" + portalProperties.getId() + ", name=" + moduleProperties.getName() + ", version="
								+ moduleProperties.getVersion() + ", resource=" + resource + ", method=" + moduleProperties.getMethod());

						var module = this.moduleLoader.loadModule(portalProperties, moduleProperties);

						if (module == null) {
							logger.error("Unable to load module, portalId=" + portalProperties.getId() + ", name=" + moduleProperties.getName()
									+ ", version=" + moduleProperties.getVersion() + ", resource=" + resource + ", method="
									+ moduleProperties.getMethod())

							continue;
						}

						switch (moduleProperties.getMethod()) {
							case WebserverConstants.HTTP_GET:
							case WebserverConstants.HTTP_POST:
								this.resources[moduleProperties.getMethod()].push({
									module : module,
									url : resource
								});
								break;

							default:
								logger.error("Method not supported, name=" + moduleProperties.getName() + ", resource=" + portalProperties.getId()
										+ moduleProperties.getResource() + ", method=" + moduleProperties.getMethod());
								break;
						}

						logger.info("Finished processing module, portalId=" + portalProperties.getId() + ", name=" + moduleProperties.getName()
								+ ", version=" + moduleProperties.getVersion() + ", resource=" + resource + ", method="
								+ moduleProperties.getMethod());
					}
				}

				logger.info("Finished processing portal, portalId=" + portalProperties.getId() + ", modules="
						+ (modules != null ? modules.length : null));
			}
		}
	}

	/**
	 * TODO
	 */
	this.getModuleByResource = function(url, method) {
		logger.info("get Module by resource " + url + " " + method);
		if (this.resources[method] != null && this.resources[method].length > 0) {
			for (var i = 0; i < this.resources[method].length; i++) {
				var resource = this.resources[method][i];
        logger.info("Resource" + resource + " URL "+ resource.url);
				if (resource.url == url) {
					return resource.module;
				}
			}
		}

		return this.getPortalModule(url);
	}

	/**
	 * TODO
	 */
	this.getPortalModule = function(url) {
		if (this.resources[WebserverConstants.HTTP_GET] != null && this.resources[WebserverConstants.HTTP_GET].length > 0) {
			for (var i = 0; i < this.resources[WebserverConstants.HTTP_GET].length; i++) {
				var resource = this.resources[WebserverConstants.HTTP_GET][i];
				var module = resource.module;

				if(module != null && module["isPortalModule"] != null && module.isPortalModule()) {
					var portalId = module.portalProperties != null ? module.portalProperties.getId() : null;

					if(url.replace(/\//g, "").indexOf(portalId) == 0) {
						return module;
					}
				}
			}
		}

		return null;
	}

	/**
	 * TODO
	 */
	this.dispatch = function(request, response) {
		var url = require('url').parse(request.url, true);
		var method = request.method.toUpperCase();

		logger.info("Received request, url=" + url.pathname + ", method=" + method);

		var module = this.getModuleByResource(url.pathname, method);

		if (module != null) {
			logger.info("Forwarding request to module, url=" + url.pathname + ", method=" + method);

			module.handleRequest(request, response);
		} else {
			logger.error("Module not found, url=" + url.pathname + ", method=" + method);

			// TODO return error response
		}
	}
};
