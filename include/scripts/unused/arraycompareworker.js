self.addEventListener("message", function(e) {
	var data1 = e.data.Data1;
	var data2 = e.data.Data2;
	
	var index = e.data.Index;
	var skip = e.data.Skip;
	
	if (data2 != null)
	{
		var list = [];
		for(x=0;x<data2.length;x++)
		{
			var sms = data2[x];
			var Regex = /([0-9]+)-([0-9]+)(.+)/g;
			var match = Regex.exec(sms.Message);
			if(match != null)
			{
				var trackingID = match[1] + "-" + match[2];
				for(y=0;y<data1.length;y++)
				{
					var tran = data1[y];
					if(tran.TrackingID == trackingID)
					{
						list.push({"Round":match[1], "Index":match[2], "Message":match[3], "Sender":sms.Sender, "TrackingID":trackingID, "Region":tran.Region, "Council":tran.Council, "Type":tran.TrackingType, "FacilityName":tran.FacilityName });
						break;
					}
				}
			}
		}
		
		var toReturn = [];
		for(x=index;x<skip;x++)
		{
			if(x < list.length) toReturn.push(list[x]);
		}
		
		postMessage({"Total":list.length, "Items":toReturn});
	}
	
}, false);