(function(window, document, JSON){
	"use strict";
	
	var XClientAddressBusy = false;
	window.XClientAddress = "unknown";

	function GetIp(callback){
		try 
		{
			var completed = null;
			var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
			if (RTCPeerConnection) (function () {
				var rtc = new RTCPeerConnection({ iceServers: [] });
				if (1 || window.mozRTCPeerConnection) {
					rtc.createDataChannel('', { reliable: false });
				};
				rtc.onicecandidate = function (evt) {
					if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
				};
				rtc.createOffer(function (offerDesc) {
					grepSDP(offerDesc.sdp);
					rtc.setLocalDescription(offerDesc);
				}, function (ex) { console.log("offer failed", ex); });

				var addrs = Object.create(null);
				addrs["0.0.0.0"] = false;
				function updateDisplay(newAddr) {
					clearTimeout(completed);
					
					if (newAddr in addrs) return;
					else addrs[newAddr] = true;
					var ips = Object.keys(addrs).filter(function (k) { return addrs[k]; });
					completed = setTimeout(function(){
						if (callback != undefined && typeof(callback) === "function")callback(ips);
					},300);
				}

				function grepSDP(sdp) {
					var hosts = [];
					var lines = sdp.split('\r\n');
					lines.forEach(function (line) {
						if (~line.indexOf("a=candidate")) {
							var parts = line.split(' ');
							var addr = parts[4];
							var type = parts[7];
							if (type === 'host') updateDisplay(addr);
						} else if (~line.indexOf("c=")) {
							var parts = line.split(' ');
							var addr = parts[2];
						}
					});
				}
			})();
		} 
		catch (ex) { console.log(ex);}
	}

	(function(xhr) {
		var open = XMLHttpRequest.prototype.open;
		xhr.prototype.open = function() {
		   //console.log(JSON.stringify(arguments));
		   open.apply(this, arguments);
		};
		
		var send = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.send = function(data) {
			if(window.XClientAddress == "unknown" && XClientAddressBusy == false) 
			{
				XClientAddressBusy = true;
				GetIp(function(ip) 
				{ 
					XClientAddressBusy = false;
					window.XClientAddress = ip.join("|") || "unknown"; 
				});
			}

			this.setRequestHeader("X-ClientAddress",window.XClientAddress);
			this.setRequestHeader("X-FingerPrint",window.fingerprint.md5hash); 
			
			return send.apply(this, arguments);
		};

	})(XMLHttpRequest);
}(window, document, JSON ));