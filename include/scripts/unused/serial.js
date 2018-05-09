function serial()
{
	this.socket = null;
	this.id = null;

	this.getDevices = function(callback){
		if (IsExposed()){
			Serial.getDevices(function(data){
				if (callback != undefined && typeof(callback) === "function")callback(data);
			});
		}
		else if (callback != undefined && typeof(callback) === "function")callback(data);
	}

	this.connect = function(path, baudrate, databits, paritybit, stopbits, handshake, callback){
		var _this = this;
		if ("WebSocket" in window) {
			_this.id = path;
			var serviceUrl = 'ws://127.0.0.1:20481/Serial';
			_this.socket = new WebSocket(serviceUrl);
			 		
			_this.socket.onopen = function () {
				var data = {'Status':'Connect', 'Data': {'Path':path, 'BaudRate':baudrate, 'DataBits':databits, 'Parity':paritybit, 'StopBits':stopbits, 'Handshake':handshake}};
				_this.socket.send(JSON.stringify(data));				
				if (callback != undefined && typeof(callback) === "function")callback({'Status':'Connected','Data':'Connection Established!'});
			};
 
			_this.socket.onclose = function () {
				if (callback != undefined && typeof(callback) === "function")callback({'Status':'Disconnected','Data':'Connection Closed!'});
			};
 
			_this.socket.onerror = function (error) {
				if (callback != undefined && typeof(callback) === "function")callback({'Status':'Error','Data':error});
			};
 
			_this.socket.onmessage = function (e) {
				var msg = JSON.parse(e.data);
				if(msg != undefined && msg != null){
					if(msg.Status == "Failed" && msg.Data == "Already connected"){
						_this.socket.close();
						_this.id = null;
						_this.socket = null;
					}
					else if (callback != undefined && typeof(callback) === "function")callback({'Status':'Message','Data':e.data});
				}
				else if (callback != undefined && typeof(callback) === "function")callback({'Status':'Message','Data':e.data});
			}; 
    	}
		else throw 'WebSocket not implemented';
	}

	this.disconnect = function(callback){
		if ("WebSocket" in window) {
			if(this.socket != null){
				this.socket.close();
				if (callback != undefined && typeof(callback) === "function")callback();
			}
			else if (callback != undefined && typeof(callback) === "function")callback();
		}
		else throw 'WebSocket not implemented';
	}

	this.write = function(value){
		if ("WebSocket" in window) {
			var data = {'Status':'Message', 'Data': {'Value':value, 'Key':this.id}};
			if(this.socket != null && this.id != null)this.socket.send(JSON.stringify(data));
		}
		else throw 'WebSocket not implemented';
	}

	this.writeLine = function(value){
		if ("WebSocket" in window) {
			var data = {'Status':'Message', 'Data': {'Value':value+'\r\n', 'Key':this.id}};
			if(this.socket != null && this.id != null)this.socket.send(JSON.stringify(data));
		}
		else throw 'WebSocket not implemented';
	}
}