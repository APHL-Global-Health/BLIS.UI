function SetCalendarDate(item, dt){
	var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
	item.find(".CalendarInfo").html('<span>'+dt.getDate()+' '+monthNames[dt.getMonth()]+' '+dt.getFullYear()+'</span>');
}

function InitializeCalendars(){
	var today = new Date();
	$(document).find('.CalendarParent').each(function(){		
		SetCalendarDate($(this), today);
	});
}

function GetCalendarDate(cal){
	var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
	var dtText = cal.find('.CalendarInfo span').text();
	if(dtText != undefined)
	{
		var myRegexp = /([0-9]+) (JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER) ([0-9]+)/g;
		if(dtText.match(myRegexp))
		{
			var match = myRegexp.exec(dtText);
			day = match[1];
			year = match[3];
			month = monthNames.indexOf(match[2])+1;			
			return new Date(year, month-1, day);
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
		subinfo.html('<span>'+_year+'</span>');
		subinfo.unbind( "click" );
		subinfo.click(function() 
		{ 
			return false;
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
				
				cal.find(".Months").removeClass('FlexDisplay');
				cal.find(".Days").addClass('FlexDisplay');
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
			calenderEvent(cal, _year, _month, _day, selected, event);
			return false;
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
				cal.find(".CalendarInfo").html('<span>'+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+'</span>');
				cal.removeClass('Opened');
				SelectedDate(cal, selected);
				return false;
			});
		}

		var firstDay = new Date(_year, _month-1, 1);
		var dayIndex = firstDay.getDay()+1;
		
		if(selected.getMonth() == _month-1 && selected.getFullYear() == _year) 
			cal.find(".CalendarInfo").html('<span>'+selected.getDate()+' '+monthNames[selected.getMonth()]+' '+selected.getFullYear()+'</span>');
		//else 
		//	cal.find(".CalendarInfo").html('<span>'+monthNames[_month-1]+' '+_year+'</span>');
			
		subinfo.html('<span>'+monthNames[_month-1]+'</span>');
			

		for(x=1;x<dayIndex; x++)
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