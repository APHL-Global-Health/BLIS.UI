function callback(response, error){
	if(error == null){
		response.text()
		.then(data => {					
			console.log(data);
		});	
	}
	else console.error(error);
}

fetch('index.htm')
.then((response)=>{ 
	if (response.ok) { return response } 
	else return response.text().then(data => { return Promise.reject({ status: response.status, statusText: response.statusText, message: data }) ; });
})
.then(response =>{ if (callback != undefined && typeof(callback) === "function")callback(response, null); })
.catch(error => { if (callback != undefined && typeof(callback) === "function")callback(null, error); });
