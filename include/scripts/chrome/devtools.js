define(function(require) {
	'use strict';
	
	const http = -1;
	const https = -1;
	const externalRequest = require('include/scripts/chrome/external-request');
	
	// options.path must be specified; callback(err, data)
	function devToolsInterface(options, callback) {
		options.host = options.host || defaults.HOST;
		options.port = options.port || defaults.PORT;
		options.secure = !!(options.secure);
		externalRequest(options.secure ? https : http, options, callback);
	}

	// wrapper that allows to return a promise if the callback is omitted, it works
	// for DevTools methods
	function promisesWrapper(func) {
		return function (options, callback) {
			// options is an optional argument
			if (typeof options === 'function') {
				callback = options;
				options = undefined;
			}
			options = options || {};
			// just call the function otherwise wrap a promise around its execution
			if (typeof callback === 'function') {
				func(options, callback);
			} else {
				return new Promise(function (fulfill, reject) {
					func(options, function (err, result) {
						if (err) {
							reject(err);
						} else {
							fulfill(result);
						}
					});
				});
			}
		};
	}
	
	return {
		version: '0.0.1',
		// callback(err, protocol)
		Protocol : promisesWrapper(function (options, callback) {
			// if the local protocol is requested
			if (options.local) {				
				//const localDescriptor = require('libs/protocol.json');
				//callback(null, localDescriptor);
				//return;
			}
			// try to fecth the protocol remotely
			options.path = '/json/protocol';
			devToolsInterface(options, function (err, descriptor) {
				if (err) {
					callback(err);
				} else {
					callback(null, JSON.parse(descriptor));
				}
			});
		}),
		List : promisesWrapper(function (options, callback) {
			options.path = '/json/list';
			devToolsInterface(options, function (err, tabs) {
				if (err) {
					callback(err);
				} else {
					callback(null, JSON.parse(tabs));
				}
			});
		}),
		New : promisesWrapper(function (options, callback) {
			options.path = '/json/new';
			if (Object.prototype.hasOwnProperty.call(options, 'url')) {
				options.path += '?' + options.url;
			}
			devToolsInterface(options, function (err, tab) {
				if (err) {
					callback(err);
				} else {
					callback(null, JSON.parse(tab));
				}
			});
		}),
		Activate : promisesWrapper(function (options, callback) {
			options.path = '/json/activate/' + options.id;
			devToolsInterface(options, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
		}),
		Close : promisesWrapper(function (options, callback) {
			options.path = '/json/close/' + options.id;
			devToolsInterface(options, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
		}),
		ChromeVersion : promisesWrapper(function (options, callback) {
			options.path = '/json/version';
			devToolsInterface(options, function (err, versionInfo) {
				if (err) {
					callback(err);
				} else {
					callback(null, JSON.parse(versionInfo));
				}
			});
		})
	}
});