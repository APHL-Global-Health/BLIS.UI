define(function(require) {
	'use strict';	
	
	const EventEmitter 	= require('include/scripts/chrome/events');
	const defaults 		= require('include/scripts/chrome/defaults');
	const api 			= require('include/scripts/chrome/api');
	const devtools 		= require('include/scripts/chrome/devtools');
	
	class ProtocolError extends Error {
		constructor(request, response) {
			let message = response.message;
			if (response.data) {
				message += ` (${response.data})`;
			}
			super(message);
			// attach the original response as well
			this.request = request;
			this.response = response;
		}
	}

	class Chrome extends EventEmitter {
		constructor(options) {
			super();

			const defaultTarget = function (targets) {
				let backup;
				let target = targets.find((target) => {
					if (target.webSocketDebuggerUrl) {						
						backup = backup || target;
						return target.type === 'page';
					} else {
						return false;
					}
				});
				target = target || backup;
				if (target) {
					return target;
				} else {
					throw new Error('No inspectable targets');
				}
			};
			options = options || {};
			this.host = options.host || defaults.HOST;
			this.port = options.port || defaults.PORT;
			this.secure = !!(options.secure);
			this.protocol = options.protocol;
			this.local = !!(options.local);
			this.target = options.target || options.tab || options.chooseTab || defaultTarget;
			
			if(options.events) {
				for(var eventName in options.events) {
					if(options.events.hasOwnProperty(eventName) &&
					   typeof options.events[eventName] === 'function') {
						this.signals.on(eventName, options.events[eventName], this);
					}
				}
			}
			
			this._callbacks = {};
			this._nextCommandId = 1;
			this.webSocketUrl = undefined;
			start.call(this);
		}
		
		static newPage(args,callback) {
			const _args = args || {};
			const _host = _args.host || defaults.HOST;
			const _port = _args.port || defaults.PORT;
			Chrome.queryBrowser("http://"+_host+":"+_port+"/json/new", callback);
		};
		
		static closePage(args,callback) {
			const _args = args || {};
			const _id 	= _args.id;
			const _host = _args.host || defaults.HOST;
			const _port = _args.port || defaults.PORT;
			if(_id != undefined && _id != null)
				Chrome.queryBrowser("http://"+_host+":"+_port+"/json/close/"+_id, callback);
			else
				callback(null, new Error("id: missing or is not valid number"));
		};
		
		static activatePage(args,callback) {
			const _args = args || {};
			const _id 	= _args.id;
			const _host = _args.host || defaults.HOST;
			const _port = _args.port || defaults.PORT;
			if(_id != undefined && _id != null)
				Chrome.queryBrowser("http://"+_host+":"+_port+"/json/activate/"+_id, callback);
			else
				callback(null, new Error("id: missing or is not valid number"));
		};
		
		static getVersion(args, callback) {
			const _args = args || {};
			const _host = _args.host || defaults.HOST;
			const _port = _args.port || defaults.PORT;
			Chrome.queryBrowser("http://"+_host+":"+_port+"/json/version", callback);
		};
			
		static listTabs(args, callback) {
			const _args = args || {};
			const _host = _args.host || defaults.HOST;
			const _port = _args.port || defaults.PORT;
			Chrome.queryBrowser("http://"+_host+":"+_port+"/json/list", callback);
		};
		
		static getProtocol(args, callback) {
			const _args = args || {};
			const _host = _args.host || defaults.HOST;
			const _port = _args.port || defaults.PORT;
			Chrome.queryBrowser("http://"+_host+":"+_port+"/json/protocol", callback);
		};
		
		static getRemoteDebugginsSessions(args,callback) {
			const _args = args || {};
			const _host = _args.host || defaults.HOST;
			const _port = _args.port || defaults.PORT;
			Chrome.queryBrowser("http://"+_host+":"+_port+"/json", callback);
		};
		
		static queryBrowser(query,callback){
			fetch(query)
			.then(function(response) {
				return response.json();
			})
			.then(function(response) {
				callback(response, null);
			})
			.catch(error => callback(null, error));
		}
	}

	Chrome.prototype.inspect = function (depth, options) {
		options.customInspect = false;
		return;// util.inspect(this, options);
	};
	
	Chrome.prototype.send = function (method, params, callback) {
		const chrome = this;
		if (typeof params === 'function') {
			callback = params;
			params = undefined;
		}
		// return a promise when a callback is not provided
		if (typeof callback === 'function') {
			enqueueCommand.call(chrome, method, params, callback);
		} else {
			return new Promise(function (fulfill, reject) {
				enqueueCommand.call(chrome, method, params, function (error, response) {
					if (error) {
						const request = {
							'method': method,
							'params': params
						};
						reject(error instanceof Error
							   ? error // low-level WebSocket error
							   : new ProtocolError(request, response));
					} else {
						fulfill(response);
					}
				});
			});
		}
	};
	
	Chrome.prototype.close = function (callback) {
		const chrome = this;
		function closeWebSocket(callback) {
			// don't notify on user-initiated shutdown ('disconnect' event)
			chrome._ws.removeAllListeners('close');
			chrome._ws.close();
			chrome._ws.once('close', function () {
				chrome._ws.removeAllListeners();
				callback();
			});
		}
		if (typeof callback === 'function') {
			closeWebSocket(callback);
		} else {
			return new Promise(function (fulfill, reject) {
				closeWebSocket(fulfill);
			});
		}
	};
	
	function enqueueCommand(method, params, callback) {
		const chrome = this;
		const id = chrome._nextCommandId++;
		const message = {'id': id, 'method': method, 'params': params || {}};	

		try {
			chrome._ws.send(JSON.stringify(message));
			chrome._callbacks[id] = callback;
		} catch (err) {
			if (typeof callback === 'function') {
				callback(err);
			}
		}
	}
	
	function handleMessage(message) {
		const chrome = this;		
		// command response
		if (message.id) {			
			const callback = chrome._callbacks[message.id];
			if (!callback) {
				return;
			}			
			// interpret the lack of both 'error' and 'result' as success
			// (this may happen with node-inspector)
			if (message.error) {
				callback(true, message.error);
			} else {
				callback(false, message.result || {});
			}
			// unregister command response callback
			delete chrome._callbacks[message.id];
			// notify when there are no more pending commands
			if (Object.keys(chrome._callbacks).length === 0) {
				chrome.emit('ready', this);
			}
		}
		// event
		else if (message.method) {
			chrome.emit('event', this, message);
			chrome.emit(message.method, this, message.params);
		}
	}

	function fetchProtocol(options) {
		const chrome = this;
		return new Promise(function (fulfill, reject) {
			// if a protocol has been provided then use it			
			if (chrome.protocol) {
				fulfill(chrome.protocol);
			}
			// otherwise user either the local or the remote version
			else {
				options.local = chrome.local;
				devtools.Protocol(options).then(function (protocol) {
					api.prepare(chrome, protocol)
					.then(b=>fulfill(protocol));
				}).catch(reject);
			}
		});
	}

	function fetchFromObject(fulfill, reject, target) {
		const url = (target || {}).webSocketDebuggerUrl;
		if (url) {
			fulfill(url);
		} else {
			const targetStr = JSON.stringify(target, null, 4);
			const err = new Error('Invalid target ' + targetStr);
			reject(err);
		}
	}

	function fetchDebuggerURL(options) {
		const chrome = this;		
		return new Promise(function (fulfill, reject) {
			// note: when DevTools are open or another WebSocket is connected to a
			// given target the 'webSocketDebuggerUrl' field is not available
			let userTarget = chrome.target;			
			switch (typeof userTarget) {
			case 'string':
				// use default host and port if omitted (and a relative URL is specified)
				if (userTarget.startsWith('/')) {
					const prefix = 'ws://' + chrome.host + ':' + chrome.port;
					userTarget = prefix + userTarget;
				}
				// a WebSocket URL is specified by the user (e.g., node-inspector)
				if (userTarget.match(/^wss?:/i)) {
					fulfill(userTarget);
				}
				// a target id is specified by the user
				else {
					devtools.List(options).then(function (targets) {
						return targets.find(function (target) {
							return target.id === userTarget;
						});
					}).then(function (target) {
						fetchFromObject(fulfill, reject, target);
					}).catch(reject);
				}
				break;
			case 'object':
				// a target object is specified by the user
				fetchFromObject(fulfill, reject, userTarget);
				break;
			case 'function':
				// a function is specified by the user
				devtools.List(options).then(function (targets) {
					const result = userTarget(targets);						
					if (typeof result === 'number') {
						return targets[result];
					} else {
						return result;
					}
				}).then(function (target) {
					fetchFromObject(fulfill, reject, target);
				})
				.catch(reject);
				break;
			default:
				reject(new Error('Invalid target argument "' + chrome.target + '"'));
			}
		});
	}
	
	function connectToWebSocket(url) {
		const chrome = this;
		return new Promise(function (fulfill, reject) {
			// create the WebSocket
			try {
				if (chrome.secure) {
					url = url.replace(/^ws:/i, 'wss:');
				}
				chrome._ws = new WebSocket(url);
			} catch (err) {
				// handles bad URLs
				reject(err);
				return;
			}
			// set up event handlers
			chrome._ws.onopen = () => {
				fulfill();
			};
			chrome._ws.onclose = () => {
				chrome.emit('disconnect', this);
			};
			chrome._ws.onmessage = (event) => {					
				const message = JSON.parse(event.data);					
				handleMessage.call(chrome, message);
			};
			chrome._ws.onerror = () => {
				reject(err);
			};
		});
	}
	
	function parseUrl(href) {
		var match = href.match(/^(https?|ws\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
		return match && {
			href: href,
			protocol: match[1],
			host: match[2],
			hostname: match[3],
			port: match[4],
			pathname: match[5],
			search: match[6],
			hash: match[7]
		}
	}

	function start() {
		const chrome = this;
		
		const options = {'host': chrome.host, 'port': chrome.port, 'secure': chrome.secure};
		// fetch the WebSocket debugger URL
		fetchDebuggerURL.call(chrome, options)
		.then(function (url) {
			chrome.webSocketUrl = url;
			// update the connection parameters using the debugging URL
			const urlObject = parseUrl(url);
			options.host = urlObject.hostname;
			options.port = urlObject.port || options.port;
			// fetch the protocol and prepare the API			
			return fetchProtocol.call(chrome, options)
			//.then(prot => api.prepare(chrome, prot)); //api.prepare.bind(chrome)
		}).then(function (values) {
			// finally connect to the WebSocket
			return connectToWebSocket.call(chrome, chrome.webSocketUrl);
		})
		.then(function () {
			chrome.emit('connect', this, chrome);
		}).catch(function (err) {
			chrome.emit('error', this, err);
		});		
	}
	
	return Chrome;
});