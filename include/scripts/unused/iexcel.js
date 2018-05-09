function iEXCEL()
{
	this.Properties = {};
	this.setProperties = function(props)
	{
		this.Properties = props;
	}
	
	this.Actions = [];
	
	this.write = function(x,y,content,style)
	{
		this.Actions.push({
			"Action":"write",
			"X":x,
			"Y":y,
			"Content":content,
			"Style":style
		});
	}
	
	this.addSheet = function(title, style)
	{
		this.Actions.push({
			"Action":"addSheet",
			"Title":title,
			"Style":style
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