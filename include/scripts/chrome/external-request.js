define(function(require) {
	'use strict';
	
	// callback(err, data)
	const externalRequest = function(transport, options, callback) {
		var query = (options.secure ? "https" : "http")+"://"+options.host+":"+options.port+options.path;
		
		fetch(query,{
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			//credentials: 'same-origin', // include, same-origin, *omit
			headers: {
			  'Access-Control-Allow-Origin': '*'
			},
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, cors, *same-origin
			redirect: 'follow', // manual, *follow, error
			referrer: 'no-referrer', // *client, no-referrer
		  })
		.then(function(response) {
			return response.text();
		})
		.then(function(response) {
			callback(null, response);
		})
		.catch(error => console.log(error));
	}

	return externalRequest;
});