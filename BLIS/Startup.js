var DBConnectionString = 'MYSQLConnectionString'; 
 
function intersection_destructive(a, b){ 
  var result = []; 
  while( a.length > 0 && b.length > 0 ) 
  {   
     if      (a[0] < b[0] ){ a.shift(); } 
     else if (a[0] > b[0] ){ b.shift(); } 
     else /* they're equal */ 
     { 
       result.push(a.shift()); 
       b.shift(); 
     } 
  } 
 
  return result; 
} 
 
function intersect_safe(a, b){ 
  var ai=0, bi=0; 
  var result = []; 
 
  while( ai < a.length && bi < b.length ) 
  { 
     if      (a[ai] < b[bi] ){ ai++; } 
     else if (a[ai] > b[bi] ){ bi++; } 
     else /* they're equal */ 
     { 
       result.push(a[ai]); 
       ai++; 
       bi++; 
     } 
  } 
 
  return result; 
} 
 
String.prototype.startsWith = function(prefix) { 
    return this.indexOf(prefix) === 0; 
} 
 
String.prototype.endsWith = function(suffix) { 
    return this.match(suffix+"$") == suffix; 
}; 
 
Date.prototype.toYYYYMMDDHHMMSS = function() { 
	 
	var day = this.getDate() + ""; 
	var month = (this.getMonth() + 1) + ""; 
	var year = this.getFullYear() + ""; 
	var hour = this.getHours() + ""; 
	var minutes = this.getMinutes() + ""; 
	var seconds = this.getSeconds() + ""; 
 
	if(day<10)day='0'+day; 
	if(month<10)month='0'+month; 
	if(year<10)year='0'+year; 
	if(hour<10)hour='0'+hour; 
	if(minutes<10)minutes='0'+minutes; 
	if(seconds<10)seconds='0'+seconds; 
 
	return year + " - " + month + " - " + day + " " + hour + ":" + minutes + ":" + seconds; 
}; 
 
function keySort(array, keys){ 
 
	keys = keys || {}; 
 
	// via 
	// http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array 
	var obLen = function(obj) { 
		var size = 0, key; 
		for (key in obj) { 
			if (obj.hasOwnProperty(key)) 
				size++; 
		} 
		return size; 
	}; 
 
	// avoiding using Object.keys because I guess did it have IE8 issues? 
	// else var obIx = function(obj, ix){ return Object.keys(obj)[ix]; } or 
	// whatever 
	var obIx = function(obj, ix) { 
		var size = 0, key; 
		for (key in obj) { 
			if (obj.hasOwnProperty(key)) { 
				if (size == ix) 
					return key; 
				size++; 
			} 
		} 
		return false; 
	}; 
 
	var keySort = function(a, b, d) { 
		d = d !== null ? d : 1; 
		// a = a.toLowerCase(); // this breaks numbers 
		// b = b.toLowerCase(); 
		if (a == b) 
			return 0; 
		return a > b ? 1 * d : -1 * d; 
	}; 
 
	var KL = obLen(keys); 
 
	if (!KL) 
		return this.sort(keySort); 
 
	for ( var k in keys) { 
		// asc unless desc or skip 
		keys[k] =  keys[k] == 'desc' || keys[k] == -1  ? -1  : (keys[k] == 'skip' || keys[k] === 0 ? 0  : 1); 
	} 
 
	array.sort(function(a, b) { 
		var sorted = 0, ix = 0; 
 
		while (sorted === 0 && ix < KL) { 
			var k = obIx(keys, ix); 
			if (k) { 
				var dir = keys[k]; 
				sorted = keySort(a[k], b[k], dir); 
				ix++; 
			} 
		} 
		return sorted; 
	}); 
} 
 
function IsEmpty(d){  
	try {	return d == undefined || d == "" || d == null; } 
	catch(ex){ console.text("["+ex.name+"][IsEmpty]: "+ex.message); } 
	return false; 
}  
 
function EmptyIfNull(item){ 
	try 
	{  
		try{ return item.ToString(); } 
		catch(ex){ return item; } 
	} 
	catch(ex){ console.text("["+ex.name+"][EmptyIfNull]: "+ex.message); } 
} 
 
function SplitRemoveEmpty(item, splitter){ 
	var values = []; 
	try{ 
		var items = item.split(splitter); 
		for(var x=0;x<items.length;x++) 
		{ 
			if(items[x].trim() != '') values.push(items[x]); 
		} 
	} 
	catch(ex){ console.log("["+ex.name+"][SplitRemoveEmpty]: "+ex.message); } 
	return values; 
} 
 
function IsNumber(n){ 
  return !isNaN(n); 
} 
 
function gsm_message(id, recipients, message){ 
	this.Id = id; 
	this.Recipients = recipients; 
	this.Message = message; 
	this.SentTo = "[]"; 
	this.Error = ""; 
} 
 
function WebAPI(command, method, data){ 
	var echo = {"Status":"FAILED"}; 
	try {data = JSON.parse(data); } catch(ex){ } 
	return echo; 
} 
 
function GsmAPI(data){ 
	var success = false; 
	try{  
		 
	} 
	catch(ex){ console.log(ex.name+": "+ex.message); } 
	return success; 
} 
