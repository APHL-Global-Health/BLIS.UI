function TrackError(ex){
	try{
		var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
		var stacks = ex.stack.split("\n").filter(function(line) { return !!line.match(CHROME_IE_STACK_REGEXP); }).map(function(line) {
			
			var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);		
			var urlLike = tokens.pop();
			if (urlLike.indexOf(':') === -1) {
				var locationParts =  [urlLike];
			}

			var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
			var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
			var locationParts =  [parts[1], parts[2] || undefined, parts[3] || undefined];
			
			var functionName = tokens.join(' ') || undefined;
			var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];			
			return {
				functionName: functionName,
				fileName: fileName,
				lineNumber: locationParts[1],
				columnNumber: locationParts[2]
				//,source: line
			};
		});
		
		var stack = stacks[0];
		return {
			errorType: ex.name,
			message: ex.message,
			functionName: stack.functionName,
			fileName: stack.fileName,
			lineNumber: stack.lineNumber,
			columnNumber: stack.columnNumber,
			stacks: stacks
		}
	}
	catch(err){ console.text(err.name+": "+err.message); }
}

function IsExposed(){
	/*try{
		if(Console != null && Console != undefined) return true;
		else return false;
	}
	catch(err){ return false; }*/
	return true;
}

function LoadApp(){

}



function onResize(){
	
}

function UpdateCodeMirror(data){
	
}

function s2ab(s) { 
	var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	var view = new Uint8Array(buf);  //create uint8array as viewer
	for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
	return buf;    
}

function getScreenshotOfElement(element, posX, posY, width, height, callback) {
    html2canvas(element, {
        onrendered: function (canvas) {
            var context = canvas.getContext('2d');
            var imageData = context.getImageData(posX, posY, width, height).data;
            var outputCanvas = document.createElement('canvas');
            var outputContext = outputCanvas.getContext('2d');
            outputCanvas.width = width;
            outputCanvas.height = height;

            var idata = outputContext.createImageData(width, height);
            idata.data.set(imageData);
            outputContext.putImageData(idata, 0, 0);
            callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
        },
        width: width,
        height: height,
        useCORS: true,
        taintTest: false,
        allowTaint: false
    });
}


function onUpdated(local,remote){
	if(local != undefined && remote != undefined){
		if(local.Version == remote.Version){
			console.log("Versions are the same.");
		}
		else if(remote.Version < local.Version){
			console.log("Remote version is older. That's weird.");
		}
		else if(local.Version != remote.Version){
			$('#ipdateContent').css({"height":"58px"});
			$('#updateText').html("Version "+remote.Version+" downloaded, current version is "+local.Version+", update now?");
			$('#yesUpdateBtn').off("click");
			$('#yesUpdateBtn').click(function(){
				$('#ipdateContent').css({"height":"0px"});		
				$('#overlayContent').removeClass("Show");
				var trns = 'trans-'+$('body').attr('data-transition');
				$('#tpage').removeClass(trns+'-open');
				$('#tpage').removeClass(trns+'-out').css({'display': 'block'});
				$('#tpage').addClass(trns+'-in').delay(650).queue(function(){
					$( this ).dequeue();
					$('#loader').addClass("FlexDisplay");	
					$('#loaderText').html("Updating..");
					setTimeout(function(){
						try { if(IsExposed()){ Window.update(); } }
						catch(e){}
					}, 1000);
				});
				
			});

			$('#noUpdateBtn').off("click");
			$('#noUpdateBtn').click(function(){
				$('#ipdateContent').css({"height":"0px"});
			});
		}
	}
}

var resizeAssist = false;
function onSizeAllocated(w,h){
	if(resizeAssist){
		try{ $('body').css({"width":(w)+"px", "height":(h)+"px"}); }
		catch(e){}
	}
}
if(IsExposed()){ Window.getWindowSize(); }

function TrackError(ex){
	try{
		var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
		var stacks = ex.stack.split("\n").filter(function(line) { return !!line.match(CHROME_IE_STACK_REGEXP); }).map(function(line) {
			
			var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);		
			var urlLike = tokens.pop();
			if (urlLike.indexOf(':') === -1) {
				var locationParts =  [urlLike];
			}

			var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
			var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
			var locationParts =  [parts[1], parts[2] || undefined, parts[3] || undefined];
			
			var functionName = tokens.join(' ') || undefined;
			var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];			
			return {
				functionName: functionName,
				fileName: fileName,
				lineNumber: locationParts[1],
				columnNumber: locationParts[2]
				//,source: line
			};
		});
		
		var stack = stacks[0];
		return {
			errorType: ex.name,
			message: ex.message,
			functionName: stack.functionName,
			fileName: stack.fileName,
			lineNumber: stack.lineNumber,
			columnNumber: stack.columnNumber,
			stacks: stacks
		}
	}
	catch(err){ console.log(err.name+": "+err.message); }
}

function WebAPI(command, method, data){ 
	return {"Status":"FAILED"}; 
} 

function GsmAPI(data){ 
	return false;
}

function ProcessWeb(data){ 
	if(WebAPI != undefined && WebAPI != null)return WebAPI(data);
	return {"Status":"FAILED"};
}

function ProcessGSM(data){ 
	if(GsmAPI != undefined && GsmAPI != null)return GsmAPI(data);
	return false;
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


Date.prototype.YYYYMMDDHHMMSS = function () {
	var yyyy = this.getFullYear().toString();
	var MM = pad(this.getMonth() + 1,2);
	var dd = pad(this.getDate(), 2);
	var hh = pad(this.getHours(), 2);
	var mm = pad(this.getMinutes(), 2)
	var ss = pad(this.getSeconds(), 2)

	return yyyy +'-'+ MM +'-'+ dd+' '+hh +':'+ mm +':'+ ss;
};

Date.prototype.HHMM12 = function () {
	var hh = pad(this.getHours(), 2);
	var mm = pad(this.getMinutes(), 2)
	var ss = pad(this.getSeconds(), 2)
	var ampm = this.getHours() >= 12 ? 'PM' : 'AM';
	return hh +':'+ mm +' '+ampm;
};

Date.prototype.YYYYMMDD = function () {
	var yyyy = this.getFullYear().toString();
	var MM = pad(this.getMonth() + 1,2);
	var dd = pad(this.getDate(), 2);
	return yyyy +'-'+ MM +'-'+ dd;
};

Date.prototype.DDMMYYYY = function () {
	var yyyy = this.getFullYear().toString();
	var MM = pad(this.getMonth() + 1,2);
	var dd = pad(this.getDate(), 2);
	var hh = pad(this.getHours(), 2);
	var mm = pad(this.getMinutes(), 2)
	var ss = pad(this.getSeconds(), 2)

	return dd +"/"+ MM +"/"+ yyyy;
};

Date.prototype.DDMMMYYYY = function () {
	var monthNames = GetMonthNames(false);
	var yyyy = this.getFullYear().toString();
	var MM = monthNames[this.getMonth()];
	var dd = pad(this.getDate(), 2);
	var hh = pad(this.getHours(), 2);
	var mm = pad(this.getMinutes(), 2)
	var ss = pad(this.getSeconds(), 2)

	return dd +" "+ MM +" "+ yyyy;
};


String.prototype.FromYYYYMMDDHHMMSS = function () {
	if(this != undefined && this != null){
		var parts = this.split(" ");
		if(parts.length == 2){
			var datePart = parts[0].split("-");
			var timePart = parts[1].split(":");
			
			if(datePart.length == 3 && timePart.length == 3){
				return new Date(datePart[0],parseInt(datePart[1])-1,datePart[2],timePart[0],timePart[1],timePart[2]);
			}
		}
	}
	return null;
};

String.prototype.FromYYYYMMDD = function () {
	if(this != undefined && this != null){
		var datePart = this.split("-");	
		if(datePart.length == 3){
			return new Date(datePart[0],parseInt(datePart[1])-1,datePart[2]);
		}
	}
	return null;
};

function datediff(first, second) {
	var secs = 1000;
	var mins = 60;
	var hrs  = 60;
	var days = 24;
    return Math.round((second-first)/(secs*mins*hrs*days));
}

function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

function SelectedDate(cal, selected) { console.log(selected); }

function GetMonthNames(shortname){
	if(shortname == undefined || shortname == null)shortname = false;
	
	if(shortname) return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	else return ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
}

function SetCalendarDate(cal, dt1, dt2){	
	if(dt2 != undefined && dt2 != null){		
		var dateRange = cal.find(".CalendarBody .CalendarSubInfoParent .CalendarDateRange");
		if(dateRange != undefined && dateRange != null && dateRange.length > 0){
			var monthNames = GetMonthNames(true);
			cal.find(".CalendarInfo").html('<span>'+dt1.getDate()+' '+monthNames[dt1.getMonth()]+' '+dt1.getFullYear()+' - '+dt2.getDate()+' '+monthNames[dt2.getMonth()]+' '+dt2.getFullYear()+'</span>');
		}
		else {
			var monthNames = GetMonthNames(false);
			cal.find(".CalendarInfo").html('<span>'+dt1.getDate()+' '+monthNames[dt1.getMonth()]+' '+dt1.getFullYear()+'</span>');
		}
	}
	else {
		var monthNames = GetMonthNames(false);
		cal.find(".CalendarInfo").html('<span>'+dt1.getDate()+' '+monthNames[dt1.getMonth()]+' '+dt1.getFullYear()+'</span>');
	}
}

function CreateCalendar(cal, range=false){
	var calString = '';
	calString += '<div class="FlexDisplay FlexRow Animation-3ms" style="width:100%; margin-top:0px;">';
	calString += '	<div class="FlexDisplay  FlexGrow FlexColumn" style="width:100%; height: 100%;">';
	calString += '		<div class="DashInnerItem FlexDisplay FlexRow CalendarInfoParent" style="width:100%; height:50px; color:#616161;">';
	calString += '			<div class="FlexDisplay CalendarInfo" style="font-size: 15px; width:100%; height:100%; color:gray; padding:18px 0px 0px 24px;">';
	calString += '				<span></span>';
	calString += '			</div>';
	calString += '			<div class="FlexDisplay" style="width:16px; height:100%; margin:18px 8px 0px 8px;">';
	calString += '				<i class="mdi mdi-calendar-text"></i>';
	calString += '			</div>';
	calString += '		</div>								';
	calString += '		<div class="FlexDisplay CalendarBody White Shadow Round FlexColumn" style="overflow:hidden; width:100%; color:#616161;">';
	calString += '			<div class="DashInnerItem FlexDisplay  FlexRow Divider-Top CalendarSubInfoParent" style="width:100%; height:50px; color:#616161;">';
	calString += '				<div class="FlexDisplay CalendarSubInfoButtons Back" style="width:32px; height:100%;">';
	calString += '					<i class="mdi mdi-chevron-left" style="width:100%; height:100%; margin:18px 0px 0px 0px; text-align:center;"></i>';
	calString += '				</div>';
	calString += '				<div class="FlexDisplay CalendarSubInfo" style="font-size: 15px; width:100%; height:100%; color:gray; padding:18px 0px 0px 0px;">';
	calString += '					<span>OPTIONS</span>';
	calString += '				</div>';
	calString += '				<div class="FlexDisplay CalendarSubInfoButtons Next" style="width:32px; height:100%;">';
	calString += '					<i class="mdi mdi-chevron-right"  style="width:100%; height:100%; margin:18px 0px 0px 0px; text-align:center;"></i>';
	calString += '				</div>';
	
	if(range){
		calString += '				<div class="FlexHidden FlexDisplay FlexColumn CalendarDateRange Divider-Left Animation-3ms">';
		calString += '					<div class="FlexDisplay Flex FlexGrow CalendarDateRangeItem Start Selected Animation-3ms">';
		calString += '						<div style="font-size:16px; margin:4px 0px 0px 4px;"><i class="mdi mdi-calendar-today"></i></div>';
		calString += '					</div>';
		calString += '					<div class="FlexDisplay Flex FlexGrow Divider-Top Animation-3ms CalendarDateRangeItem End">';
		calString += '						<div style="font-size:16px; margin:4px 0px 0px 4px;"><i class="mdi mdi-calendar"></i></div>';
		calString += '					</div>';
		calString += '				</div>';
	}
	
	calString += '			</div>';	
	calString += '			<div class="DashInnerItem FlexHidden Flex FlexColumn  Divider-Top Divider-Bottom Months" style="font-size:12px; width:100%; height:100%; color:#616161;">						';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header JAN" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>JAN</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header FEB" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>FEB</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MAR" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>MAR</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header APR" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>APR</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '				</div>';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MAY" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>MAY</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header JUN" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>JUN</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header JUL" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>JUL</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header AUG" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>AUG</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '				</div>						';
	calString += '				<div class="FlexDisplay Flex FlexRow" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SEP" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>SEP</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header OCT" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>OCT</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header NOV" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>NOV</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header DEC" style="width:auto; height:100%; margin:auto; padding:32px 0px 0px 8px;">';
	calString += '							<span>DEC</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '				</div>						';
	calString += '			</div>';
	calString += '			<div class="DashInnerItem FlexHidden FlexDisplay Flex FlexColumn  Divider-Top Divider-Bottom Days" style="font-size:10px; width:100%; height:100%; color:#616161;">						';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">							';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarHeader" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span>S</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarHeader" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span>M</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarHeader" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span>T</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarHeader" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span>W</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarHeader" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span>T</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarHeader" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span>F</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarHeader" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span>S</span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '				</div>';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">							';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SUN1" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MON1" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header TUE1" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header WED1" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header THU1" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header FRI1" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SAT1" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '				</div>						';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SUN2" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MON2" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header TUE2" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header WED2" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header THU2" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header FRI2" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SAT2" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>							';
	calString += '				</div>	';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SUN3" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MON3" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header TUE3" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header WED3" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header THU3" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header FRI3" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SAT3" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>							';
	calString += '				</div>';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%; ">';
	calString += '						<div class="FlexDisplay Header SUN4" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MON4" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header TUE4" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header WED4" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header THU4" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header FRI4" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SAT4" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '				</div>';
	calString += '				<div class="FlexDisplay Flex FlexRow Divider-Bottom" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SUN5" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MON5" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header TUE5" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header WED5" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header THU5" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header FRI5" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SAT5" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>							';
	calString += '				</div>';
	calString += '				<div class="FlexDisplay Flex FlexRow" style="width:100%; height:100%; color:#616161;">';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SUN6" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header MON6" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header TUE6" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header WED6" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header THU6" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow Divider-Right CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header FRI6" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '					<div class="FlexDisplay Flex FlexRow CalendarItem" style="width:100%; height:100%;">';
	calString += '						<div class="FlexDisplay Header SAT6" style="width:auto; height:100%; margin:auto; padding:12px 0px 0px 4px;">';
	calString += '							<span></span>';
	calString += '						</div>';
	calString += '					</div>';
	calString += '				</div>';
	calString += '			</div>';
	calString += '		</div>';
	calString += '	</div>';
	calString += '</div>';
	cal.html(calString);
}

function InitializeCalendars(){
	var today = new Date();
	
	$(document).find('.CalendarParent').each(function(){
		CreateCalendar($(this));
		
		var dateRange = $(this).find(".CalendarBody .CalendarSubInfoParent .CalendarDateRange");
		if(dateRange != undefined && dateRange != null && dateRange.length > 0){
			var monthNames = GetMonthNames(true);
			
			$(this).find(".CalendarInfo").css({"font-size":"14px"});			
			$(this).find(".CalendarInfo").html('<span>'+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+' - '+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+'</span>');
		}
		else {
			var monthNames = GetMonthNames(false);
			$(this).find(".CalendarInfo").html('<span>'+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+'</span>');
		}
	});
}

function GetCalendarDate(cal){
	var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
	var dtText = cal.find('.CalendarInfo span').text();
	if(dtText != undefined)
	{
		var myRegexp = null;
		var dateRange = cal.find(".CalendarBody .CalendarSubInfoParent .CalendarDateRange");
		if(dateRange != undefined && dateRange != null && dateRange.length > 0){
			monthNames = GetMonthNames(true);
			myRegexp = /([0-9]+) (JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) ([0-9]+) - ([0-9]+) (JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) ([0-9]+)/g;
		}
		else {
			monthNames = GetMonthNames(false);
			myRegexp = /([0-9]+) (JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER) ([0-9]+)/g;
		}
		var m = dtText.match(myRegexp);
		if(m != null)
		{
			var match = myRegexp.exec(dtText);

					
			var day = match[1];
			var year = match[3];
			var month = monthNames.indexOf(match[2])+1;	
			var dt = new Date(year, month-1, day);
			
			if(dateRange != undefined && dateRange != null && dateRange.length > 0){
				day = match[4];
				year = match[6];
				month = monthNames.indexOf(match[5])+1;	
				odt = new Date(year, month-1, day);
				return [dt,odt];
			}			
			else return [dt];
		}
	}
	return null;
}

function daysInMonth(month,year) {
	return new Date(year, month, 0).getDate();
}

function calenderEvent(cal, _year, _month, _day, selected, event){
	if(cal.find(".Months").hasClass('FlexDisplay'))
	{
		var today = new Date();
		var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		
		var subinfo = cal.find(".CalendarSubInfo");
		subinfo.html('<span style="display:block; width:100%; height:100%; text-align:center;">'+_year+'</span>');
		subinfo.unbind( "click" );
		subinfo.click(function() 
		{ 
			return false;
		});
		
		cal.find(".CalendarSubInfoParent .CalendarSubInfoButtons").each(function(){
			$(this).unbind( "click" );
			$(this).click(function(e) 
			{ 
				_year = parseInt(subinfo.text());
				if($(this).hasClass('Back')){
					if(_year > 1900)subinfo.html('<span style="display:block; width:100%; height:100%; text-align:center;">'+(_year-1)+'</span>');
				}
				else if($(this).hasClass('Next')){
					subinfo.html('<span style="display:block; width:100%; height:100%; text-align:center;">'+(_year+1)+'</span>');
				}
				return false;
			});
		});
		
		cal.find(".CalendarDateRange .CalendarDateRangeItem").each(function(){
			$(this).unbind( "click" );
			$(this).click(function(e) 
			{ 
				cal.find('.CalendarDateRange .CalendarDateRangeItem').each(function(){
					$(this).removeClass('Selected');
				});
				$(this).addClass('Selected');
				
				return false;
			});
		});
		
		cal.find('.Months .'+monthNames[today.getMonth()]).parent().addClass('Today');
		cal.find('.Months .CalendarItem').each(function(){
			$(this).unbind( "click" );
			$(this).click(function(e) 
			{ 
				cal.find('.Months .CalendarItem').each(function(){
					$(this).removeClass('Selected');
				});
				$(this).addClass('Selected');
				
				_month = monthNames.indexOf($(this).find('span').text());
				_year = parseInt(subinfo.text());
				
				cal.find(".Months").removeClass('FlexDisplay');
				cal.find(".Days").addClass('FlexDisplay');
				cal.find(".CalendarDateRange").addClass('FlexDisplay');
				calenderEvent(cal, _year, _month+1, _day, selected, event);
				return false;
			});
		});
		

	}
	else if(cal.find(".Days").hasClass('FlexDisplay'))
	{
		var week = 1;
		var daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
		var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
		
		cal.find('.Days .CalendarItem').each(function(){
			$(this).removeClass('Selected');
		});
		
		var subinfo = cal.find(".CalendarSubInfo");
		subinfo.unbind( "click" );
		subinfo.click(function(e) 
		{ 
			cal.find(".Months").addClass('FlexDisplay');
			cal.find(".Days").removeClass('FlexDisplay');
			cal.find(".CalendarDateRange").removeClass('FlexDisplay');
			calenderEvent(cal, _year, _month, _day, selected, event);
			return false;
		});
		
		cal.find(".CalendarSubInfoParent .CalendarSubInfoButtons").each(function(){
			$(this).unbind( "click" );
			$(this).click(function(e) 
			{ 
				var cur_month = monthNames.indexOf(subinfo.text());
				if($(this).hasClass('Back')){
					if(cur_month>0){
						cal.find(".Months").removeClass('FlexDisplay');
						cal.find(".Days").addClass('FlexDisplay');
						calenderEvent(cal, _year, cur_month, _day, selected, event);
					}
				}
				else if($(this).hasClass('Next')){
					if(cur_month+2<13){
						cal.find(".Months").removeClass('FlexDisplay');
						cal.find(".Days").addClass('FlexDisplay');
						calenderEvent(cal, _year, cur_month+2, _day, selected, event);
					}
				}				
				return false;
			});
		});
		
		cal.find(".CalendarDateRange .CalendarDateRangeItem").each(function(){
			$(this).unbind( "click" );
			$(this).click(function(e) 
			{ 
				cal.find('.CalendarDateRange .CalendarDateRangeItem').each(function(){
					$(this).removeClass('Selected');
				});
				$(this).addClass('Selected');
				
				var currentDtRange = GetCalendarDate(cal);
				if(currentDtRange != undefined && currentDtRange != null){
					if($(this).hasClass('Start')) selected = currentDtRange[0];
					else selected = currentDtRange[1];
				}
				else { selected = new Date(); }
				
				var day 	= selected.getDate();
				var year 	= selected.getFullYear();
				var month 	= selected.getMonth()+1;
				
				var shortMonthNames = GetMonthNames(true);
				cal.find('.Months .CalendarItem').each(function(){
					var selected_month = shortMonthNames[selected.getMonth()];
					if($(this).find('span').text() == selected_month){
						$(this).addClass('Selected');
					}
					else { $(this).removeClass('Selected'); }
				});
				
				cal.find(".Months").removeClass('FlexDisplay');
				cal.find(".Days").addClass('FlexDisplay');
				calenderEvent(cal, year, month, day, selected, event);
				
				return false;
			});
		});
		
		var today = new Date();
		for(x=1;x<daysInMonth(_month, _year)+1; x++)
		{
			var day = new Date(_year, _month-1, x);			
			if(day.getDay() == 0) week++;
			var item = cal.find(".Days ."+daysOfWeek[day.getDay()]+week);
			item.html('<span>'+day.getDate()+'</span>');
			item.parent().removeClass('Disabled');
			
			if(today.getDate() == day.getDate() && today.getMonth() == day.getMonth() && today.getFullYear() == day.getFullYear())
				item.parent().addClass('Today');
			else
				item.parent().removeClass('Today');
				
			if(selected.getDate() == day.getDate() && selected.getMonth() == day.getMonth() && selected.getFullYear() == day.getFullYear())
				item.parent().addClass('Selected');
							
			item.parent().unbind( "click" );
			item.parent().click(function(e) 
			{
				cal.find('.Days .CalendarItem').each(function(){
					$(this).removeClass('Selected');
				});
				$(this).addClass('Selected');
				
				var dt = parseInt($(this).find('span').text());				
				selected.setDate(dt);
				selected.setMonth(_month-1);
				selected.setFullYear(_year);
				
				var dateRange = cal.find(".CalendarBody .CalendarSubInfoParent .CalendarDateRange");
				if(dateRange != undefined && dateRange != null && dateRange.length > 0){
					monthNames = GetMonthNames(true);
					var currentDtRange = GetCalendarDate(cal);
					if(currentDtRange != undefined && currentDtRange != null){
						if(dateRange.find('.CalendarDateRangeItem.Start').hasClass('Selected')){
							cal.find(".CalendarInfo").html('<span>'+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+' - '+currentDtRange[1].getDate()+' '+monthNames[currentDtRange[1].getMonth()]+' '+currentDtRange[1].getFullYear()+'</span>');
						}
						else{ 
							cal.find(".CalendarInfo").html('<span>'+currentDtRange[0].getDate()+' '+monthNames[currentDtRange[0].getMonth()]+' '+currentDtRange[0].getFullYear()+' - '+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+'</span>');
						}
					}
				}
				else {
					monthNames = GetMonthNames(false);
					cal.find(".CalendarInfo").html('<span>'+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+'</span>');
				}
								
				cal.removeClass('Opened');
				SelectedDate(cal, GetCalendarDate(cal));
				return false;
			});
		}

		if(selected.getMonth() == _month-1 && selected.getFullYear() == _year) 
		{
			var dateRange = cal.find(".CalendarBody .CalendarSubInfoParent .CalendarDateRange");
			if(dateRange != undefined && dateRange != null && dateRange.length > 0){
				monthNames = GetMonthNames(true);
				var currentDtRange = GetCalendarDate(cal);
				if(currentDtRange != undefined && currentDtRange != null){
					if(dateRange.find('.CalendarDateRangeItem.Selected').hasClass('Start')){
						cal.find(".CalendarInfo").html('<span>'+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+' - '+currentDtRange[1].getDate()+' '+monthNames[currentDtRange[1].getMonth()]+' '+currentDtRange[1].getFullYear()+'</span>');
					}
					else{ 
						cal.find(".CalendarInfo").html('<span>'+currentDtRange[0].getDate()+' '+monthNames[currentDtRange[0].getMonth()]+' '+currentDtRange[0].getFullYear()+' - '+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+'</span>');
					}
				}
			}
			else {
				monthNames = GetMonthNames(false);
				cal.find(".CalendarInfo").html('<span>'+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+'</span>');
			}
		}
		//else 
		//	cal.find(".CalendarInfo").html('<span>'+monthNames[_month-1]+' '+_year+'</span>');
			
		monthNames = GetMonthNames(false);
		subinfo.html('<span style="display:block; width:100%; height:100%; text-align:center;">'+monthNames[_month-1]+'</span>');
				
		var firstDay = new Date(_year, _month-1, 1);
		var dayIndex = firstDay.getDay()+1;
		if(firstDay.getDay() == 0) dayIndex = 7;
					
		for(var x=1;x<dayIndex; x++)
		{
			firstDay.setDate(firstDay.getDate()-1);
			var item = cal.find(".Days ."+daysOfWeek[firstDay.getDay()]+1);
			item.html('<span>'+firstDay.getDate()+'</span>');
			item.parent().addClass('Disabled');
			item.parent().removeClass('Today');
			item.parent().unbind( "click" );
		}

		var lastDay = new Date(_year, _month, 0);
		while(lastDay.getDay() < 7 && week < 7)
		{
			lastDay.setDate(lastDay.getDate()+1);
			if(lastDay.getDay() == 0) week++;
			var item = cal.find(".Days ."+daysOfWeek[lastDay.getDay()]+week);
			item.html('<span>'+lastDay.getDate()+'</span>');
			item.parent().addClass('Disabled');
			item.parent().removeClass('Today');
			item.parent().unbind( "click" );
		}
	}
}



function PageSelection(item){

}

function Selection(item) {	
	if(item.parent().attr('class').indexOf("link_item_") > -1 || item.parent().hasClass('years') || item.parent().hasClass('months')) _Selection(item);
	else if(PageSelection != null && PageSelection != undefined)PageSelection(item) 
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    	
	$(document).on("click", ".select--generic li", function() {
		if($(this).parent().hasClass('Disabled')) { /* Do Nothing*/ }
		else if($(this).parent().hasClass('Manual')) { SelectionManual($(this)); }
		else
		{
		  if($(this).is("[data-selected]")) {
			if($(this).parent().find('li').length > 1)
			{
				$(this).parent().toggleClass('is-open');
				$(this).parent().siblings().removeClass('is-open');
			}
		  } else {
			$(this).attr('data-selected','true').siblings().removeAttr('data-selected');
			$(this).parent().removeClass('is-open'); 
			Selection($(this)); 
		  }
		}
	});

	$(document).on("click", ".select--editable li", function() {
		if($(this).parent().hasClass('Disabled')) { /* Do Nothing*/ }
		else if($(this).parent().hasClass('Manual')) { SelectionManual($(this)); }
		else
		{
		  if($(this).is("[data-selected]")) {
			if($(this).parent().find('li').length > 1)
			{
				$(this).parent().toggleClass('is-open');
				$(this).parent().siblings().removeClass('is-open');
			}
		  } else {
			$(this).parent().find('input').val($(this).html());
			$(this).parent().removeClass('is-open'); 
			Selection($(this)); 
		  }
		}
	});
		
	$('body').click(function(e){
		var $select = $(".Selection");
		if( $select.hasClass("is-open") /*&& !$select.hasClass("Manual")*/ ) {
			$select.removeClass("is-open")
		}
		
		var $calendar = $(".CalendarParent");		
		if (!$calendar.is(e.target) && $calendar.has(e.target).length === 0)
		{
			$calendar.find(".CalendarDateRange").addClass('FlexDisplay');
			$calendar.removeClass("Opened");
		}
	});	

	$(document).on("click", ".CalendarParent", function(event) {
		if($(this).hasClass('Disabled')) { /* Do Nothing*/ }
		else if(!$(this).hasClass('Opened'))
		{
			var cal = $(this);
			var calInfo = cal.find(".CalendarBody");
			var dtText = cal.find(".CalendarInfo span").text();
			
			//var monthNames = null;
			var selected = null;			
			if(dtText != undefined)
			{
				var currentDtRange = GetCalendarDate(cal);
				if(currentDtRange != undefined && currentDtRange != null){
					var dateRange = cal.find(".CalendarBody .CalendarSubInfoParent .CalendarDateRange");
					if(dateRange != undefined && dateRange != null && dateRange.length > 0){
						if(dateRange.find('.CalendarDateRangeItem.Selected').hasClass('Start')) selected = currentDtRange[0];
						else selected = currentDtRange[1];
					}
					else selected = currentDtRange[0];
				}
				else { selected = new Date(); }
			}
			
			var day 	= selected.getDate();
			var year 	= selected.getFullYear();
			var month 	= selected.getMonth()+1;
			
			cal.find(".Months").removeClass('FlexDisplay');
			cal.find(".Days").addClass('FlexDisplay');
			calenderEvent(cal, year, month, day, selected, event);
			
			if(!cal.hasClass('Opened'))cal.addClass('Opened');
		}
		return false;
	});
  }
};