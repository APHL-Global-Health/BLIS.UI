/*!
 * ePlug 0.0.1
 * Copyright © 2018 Fredrick Mwasekaga
 */
define(function (require) {
	'use strict';
	
	const fingerprint	= require('include/scripts/md5_device_fingerprint');
	const addresses		= require('include/scripts/clientaddress');
		
	function addHeaders(parameters, options){
		if(options != undefined){
			for(var key in options){
				if(!(options[key] instanceof Function)){
					if(key.toLowerCase() == "headers" && parameters.hasOwnProperty(key)){
						for(var innerKey in options[key]){
							parameters[key][innerKey] = options[key][innerKey];
						}
					}
					else parameters[key] = options[key];
				}
			} 
		}
		return parameters;
	}
	
	function getIP() {
		return new Promise(function (fulfill, reject) {
			addresses.getIP()
			.then(addrs=>fulfill(addrs))
			.catch(reject);
		});
	}
	
	function query(url, options = {}, callback){	
		return getIP.call()
		.then(function (ip) {			
			var parameters = addHeaders({
			  headers: {
				'X-ClientAddress': ip.join("|") || "unknown",
				'X-FingerPrint': fingerprint.md5hash
			  }
			}, options);
			
			return fetch(url, parameters)
			.then(response => {
				//var buffer = '';
				var bytesReceived = 0;
				//const decoder = new TextDecoder();
				const reader = response.body.getReader();
				var stream = new ReadableStream({
					start(controller) {
						function push() {
							reader.read().then(({ done, value }) => {
							    if (callback != undefined && typeof(callback) === "function")callback(reader, bytesReceived, done);
								if (done) {
								  controller.close();
								  return;
							    }
								 
								bytesReceived += value.length;
								//buffer += decoder.decode(value, {stream: true});
							    controller.enqueue(value);
								push();
							});
						};				    
						push();
					}
			    });
				return new Response(stream);				
			});
		});
	}
	
	function get(url, options = { 'Content-Type': 'application/x-www-form-urlencoded' }, callback){
		return query(url, addHeaders({ method: 'GET' }, options), callback);
	}
	
	function post(url, data, options = { 'Content-Type': 'application/x-www-form-urlencoded' }, callback){
		return query(url, addHeaders({ method: 'POST', body: data }, options), callback);
	}
	
	return {
		version: '0.0.1',
		query : query,
		get : get,
		post : post
	};
});