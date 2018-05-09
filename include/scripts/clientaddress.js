/*!
 * ePlug 0.0.1
 * Copyright © 2018 Fredrick Mwasekaga
 */
define(function (require) {
	'use strict';
	
	function getIP(){
		return new Promise(function (fulfill, reject) {
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
							fulfill(ips);
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
			catch(ex){ reject(ex);}
		});
	}

	return {
		version: '0.0.1',
		getIP : getIP 
	};
});