"use strict";
	
var XClientAddressBusy = false;
var XClientAddress = "unknown";

function SetIP(){
	if(XClientAddress == "unknown" && XClientAddressBusy == false) 
	{
		XClientAddressBusy = true;
		GetIp(function(ip) 
		{ 
			XClientAddressBusy = false;
			XClientAddress = ip.join("|") || "unknown"; 
		});
	}
}

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

var address = function(){
	SetIP();
	return XClientAddress;
};

(function(xhr) {
	var open = XMLHttpRequest.prototype.open;
	xhr.prototype.open = function() {
	   //console.log(JSON.stringify(arguments));
	   SetIP();
	   open.apply(this, arguments);
	};	
	var send = XMLHttpRequest.prototype.send;
	xhr.prototype.send = function(data) {
		SetIP();
		var fingerprint = require('include/scripts/modules/md5_device_fingerprint.js');
		if(fingerprint != undefined)this.setRequestHeader("X-FingerPrint",fingerprint.md5hash); 
		
		this.setRequestHeader("X-ClientAddress",address());
		
		return send.apply(this, arguments);
	};

})(XMLHttpRequest);

SetIP();
return { address:address }