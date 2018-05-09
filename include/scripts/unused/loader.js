Loader = {
	headers: function(parameters, options){
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
	},
	
	query : function(url, callback, skipRTCPeerConnectionDetection, options = {})
	{
		var _this = this;
		function _query(){
			var parameters = _this.headers({
			  headers: {
				'X-ClientAddress': (window.XClientAddress != undefined ? window.XClientAddress : ''),
				'X-FingerPrint': (window.fingerprint != undefined ? window.fingerprint.md5hash : '')
			  }
			}, options);
			
			fetch(url, parameters)
			.then((response)=>{ 
				if (response.ok) { return response } 
				else return response.text().then(data => { return Promise.reject({ status: response.status, statusText: response.statusText, message: data }) ; });
			})
			.then(response =>{ if (callback != undefined && typeof(callback) === "function")callback(response, null); })
			.catch(error => { if (callback != undefined && typeof(callback) === "function")callback(null, error); });
		}

		if(skipRTCPeerConnectionDetection == false && window.XClientAddress == undefined || (window.XClientAddress != undefined && window.XClientAddress == "unknown"))
		{
			var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
			if (RTCPeerConnection){				
				var completed = null;
				var addrs = Object.create(null);
				addrs["0.0.0.0"] = false;
				window.XClientAddress = "unknown";
				function grepSDP(sdp) {
					var hosts = [];
					var lines = sdp.split('\r\n');
					lines.forEach(function (line) {
						if (~line.indexOf("a=candidate")) {
							var parts = line.split(' ');
							var addr = parts[4];
							var type = parts[7];
							if (type === 'host') {
								clearTimeout(completed);
								if (addr in addrs) return;
								else addrs[addr] = true;
								var ips = Object.keys(addrs).filter(function (k) { return addrs[k]; });
								completed = setTimeout(function(){
									window.XClientAddress = ips.join("|") || "unknown"; 
									_query();
								},300);
							}
						} else if (~line.indexOf("c=")) {
							var parts = line.split(' ');
							var addr = parts[2];
						}
					});
				}
				var rtc = new RTCPeerConnection({ iceServers: [] });
				if (1 || window.mozRTCPeerConnection) {
					rtc.createDataChannel('', { reliable: false });
				};
				rtc.onicecandidate = function (evt) {
					if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
					else { _query(); }
				};
				rtc.createOffer((offer) => rtc.setLocalDescription(offer), (error) => Promise.reject(error))		
				.catch((error) => { console.error(error); });
			}
		}
		else {  _query(); }
	},
	get : function(url, callback, options = { 'Content-Type': 'application/x-www-form-urlencoded' }, skipRTCPeerConnectionDetection = false)
	{
		return this.query(url, callback, skipRTCPeerConnectionDetection, this.headers({ method: 'GET' }, options));
	},
	post : function(url, data, callback, options = { 'Content-Type': 'application/x-www-form-urlencoded' }, skipRTCPeerConnectionDetection = false)
	{
		return this.query(url, callback, skipRTCPeerConnectionDetection, this.headers({ method: 'POST', body: data }, options));
	}
};
	

