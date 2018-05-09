SQL = {
	query : function( sql, connection, returnType, callback, executionMode = "reader" )
	{
		if(returnType == "xml" || returnType == "json"){
			if(IsExposed()){
				DB.query(sql, connection, returnType, executionMode, function(response){
					if(returnType == "json"){
						try{response = JSON.parse(response);}catch(er){}
						callback(response); 
					}
					else callback(response);  
				});
			}
			else {
				var xhr;
				var data = "SQL="+(sql)+"&Connection="+(connection)+"&ReturnType="+(returnType)+"&ExecutionMode="+(executionMode);
				if(window.location.protocol == "https:")data+="<EOF>";
				
				if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
				else {
					var versions = ["MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0",  "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
					for(var i = 0, len = versions.length; i < len; i++) {
						try 
						{
							xhr = new ActiveXObject(versions[i]);
							break;
						}catch(e){}
					}
				}
				xhr.onreadystatechange = ensureReadiness;		
				function ensureReadiness() {
					if(xhr.readyState < 4) { return; }			
					if(xhr.status !== 200) { return; }
					if(xhr.readyState === 4)
					{ 
						var response = xhr.responseText;
						if(returnType == "json")
						{
							try{response = JSON.parse(response);}catch(er){}
							callback(response); 
						}
						else callback(response); 
					}							
				}
				xhr.open('POST', "sql/query", true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("ContentLength", data.length);
				xhr.send(data);
			}
		}
		else if (callback != undefined && typeof(callback) === "function") callback("unsupported return type");
	}
}