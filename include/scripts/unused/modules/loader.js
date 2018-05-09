var headers = function(parameters, options){
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
};

var query =  function(url, callback, options = {}){
	var queryCalled = false;
	function _query(){
		if(queryCalled == false){
			queryCalled = true;
			var parameters = headers({
			  headers: {
				'X-ClientAddress': (window.XClientAddress == undefined ? "unknown" : window.XClientAddress),
				'X-FingerPrint': window.fingerprint.md5hash 
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
	}

	if(window.XClientAddress == undefined || (window.XClientAddress != undefined && window.XClientAddress == "unknown"))
	{
		var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
		if (RTCPeerConnection){				
			var completed = null;
			var ispending = null;
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
				else { 
					clearTimeout(ispending);
					ispending = setTimeout(function(){
						_query();
					},1000);
				}
			};
			rtc.createOffer((offer) => rtc.setLocalDescription(offer), (error) => Promise.reject(error))		
			.catch((error) => { console.error(error); });
		}
		else { _query(); }
	}
	else { _query(); }
};

var get = function(url, callback, options = { 'Content-Type': 'application/x-www-form-urlencoded' })
{
	return query(url, callback, headers({ method: 'GET' }, options));
};

var post = function(url, data, callback, options = { 'Content-Type': 'application/x-www-form-urlencoded' })
{
	return query(url, callback, headers({ method: 'POST', body: data }, options));
};

/*var query = function(url, method, data=null, contentType="application/x-www-form-urlencoded", callback)
{
	try
	{
		var xhr;		
		if(data != null && data != undefined && window.location.protocol == "https:")data+="<EOF>";		
		if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
		else 
		{
			var versions = ["MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0",  "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
			for(var i = 0, len = versions.length; i < len; i++) {
				try 
				{
					xhr = new ActiveXObject(versions[i]);
					break;
				}catch(e){}
			}
		}

		if(callback != undefined && typeof(callback) === "function")
		{
			xhr.onreadystatechange =  function() {
				//console.log(xhr);
				if(xhr.readyState < 4) { return; }			
				if(xhr.status !== 200) { return; }
				if(xhr.readyState === 4) { callback(xhr.responseText);  }
			}
			xhr.open(method, url, true);
			xhr.setRequestHeader("Content-Type", contentType);
			if(data != null && data != undefined)xhr.setRequestHeader("ContentLength", data.length);
			xhr.send(data);
			return xhr;
		}
		else
		{
			xhr.open(method, url, false);
			xhr.setRequestHeader("Content-Type", contentType);
			if(data != null && data != undefined)xhr.setRequestHeader("ContentLength", data.length);
			xhr.send(data);
			
			return xhr.responseText;
			
		}
	}
	catch(ex) { throw ex; }
};

var get = function( url, callback, contentType = "application/x-www-form-urlencoded" )
{
	return query(url, "get", null, contentType, callback);
};

var post = function( url, data, callback, contentType = "application/x-www-form-urlencoded" )
{
	return query(url, "post", data, contentType, callback);
};*/

return { query:query, get:get, post:post };