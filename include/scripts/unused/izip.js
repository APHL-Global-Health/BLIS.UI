function iZIP()
{
	this.Properties = {};
	this.setProperties = function(props)
	{
		this.Properties = props;
	}
	
	this.Actions = [];
	
	this.addFile = function(file,content)
	{
		this.Actions.push({
			"Action":"addFile",
			"File":file,
			"Content":content
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