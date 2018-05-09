function iPDF()
{
	this.internal = {
		"pageSize" : {
			"width" : 612,// 210.00197555866663,
			"height" : 792// 297.0006773335
		}
	};
	
	this.Properties = {};
	this.setProperties = function(props)
	{
		this.Properties = props;
	}
	
	this.Actions = [];
	
	this.setFontSize = function(size)
	{
		this.Actions.push({
			"Action":"setFontSize",
			"Size":size
		});
	}
	
	this.setFontType = function(style)
	{
		this.Actions.push({
			"Action":"setFontType",
			"Style":style
		});
	}
	
	this.text = function(text, x, y, flags)
	{
		this.Actions.push({
			"Action":"text",
			"Text":text,
			"X":x,
			"Y":y,
			"Flags":flags
		});
	}
	
	this.textWithWrap = function(text, x, y, size, border)
	{
		this.Actions.push({
			"Action":"textWithWrap",
			"Text":text,
			"X":x,
			"Y":y,
			"Size":size,
			"Border":border
		});
	}
	
	this.setDrawColor = function(ch1, ch2, ch3, ch4)
	{
		this.Actions.push({
			"Action":"setDrawColor",
			"Ch1":ch1,
			"Ch2":ch2,
			"Ch3":ch3,
			"Ch4":ch4
		});
	}
	
	this.setLineWidth = function(width)
	{
		this.Actions.push({
			"Action":"setLineWidth",
			"Width":width
		});
	}
	
	this.rect = function(x, y, w, h, style)
	{
		this.Actions.push({
			"Action":"rect",
			"X":x,
			"Y":y,
			"W":w,
			"H":h,
			"Style":style
		});
	}
	
	this.circle = function(x, y, r, style)
	{
		this.Actions.push({
			"Action":"circle",
			"X":x,
			"Y":y,
			"R":r,
			"Style":style
		});
	}
	
	this.ellipse = function(x, y, rx, ry, style)
	{
		this.Actions.push({
			"Action":"ellipse",
			"X":x,
			"Y":y,
			"RX":rx,
			"RY":ry,
			"Style":style
		});
	}
	
	this.addImage = function(url, x, y, width, height)
	{
		this.Actions.push({
			"Action":"addImage",
			"Url":url,
			"X":x,
			"Y":y,
			"Width":(width == undefined ? 64 : width),
			"Height":(height == undefined ? 64 : height)			
		});
	}
	
	this.splitTextToSize = function(text, size)
	{
		return [text];
		//throw "Needs to get data live";
	}
	
	this.line = function(x1,y1,x2,y2)
	{
		this.Actions.push({
			"Action":"line",
			"X1":x1,
			"Y1":y1,
			"X2":x2,
			"Y2":y2
		});
	}
	
	this.addPage = function()
	{
		this.Actions.push({
			"Action":"addPage"
		});
	}
	
	this.AddWatermark = function(text)
	{
		this.Actions.push({
			"Action":"AddWatermark",
			"Text":text
		});
	}
	
	
	this.output = function(type, options)
	{
		this.Actions.push({
			"Action":"output",
			"Type":type,
			"Options":options
		});
		
		return JSON.stringify(this);
	}
}