var query = function( sql, connection, returnType, callback, executionMode = "reader" )
{
	try
	{
		if(returnType == "xml" || returnType == "json")
		{
			if(DB != null && DB != undefined){
				DB.query(sql, connection, returnType, executionMode, function(response){
					if(returnType == "json")
					{
						try{response = JSON.parse(response);}catch(er){}
						callback(response); 
					}
					else callback(response); 
				});
			}
			else
			{
				require('include/scripts/modules/loader.js', function(loader){			
					if(loader != undefined)
					{
						var data = "SQL="+(sql)+"&Connection="+(connection)+"&ReturnType="+(returnType)+"&ExecutionMode="+(executionMode);
						loader.post("sql/query", data, function(response){
							if(returnType == "json")
							{
								try{response = JSON.parse(response);}catch(er){}
								callback(response); 
							}
							else callback(response); 
						});
					}
				});
			}
			
		}
		else if (callback != undefined && typeof(callback) === "function") callback("unsupported return type");
	}
	catch(ex) { throw ex; }
}

var reader = function( sql, connection, returnType, callback){
	try{
		if(returnType == "xml" || returnType == "json"){
			if(DB != null && DB != undefined){
				if(callback != undefined && typeof(callback) === "function")DB.reader(sql, connection, returnType, callback);
			}
			else if (callback != undefined && typeof(callback) === "function") callback("DB is not defined", false, true);
		}
		else if (callback != undefined && typeof(callback) === "function") callback("unsupported return type", false, true);
	}
	catch(ex) { throw ex; }
}

return { query:query, reader:reader };