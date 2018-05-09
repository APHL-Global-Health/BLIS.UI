/*!
 * ePlug 0.0.1
 * Copyright © 2018 Fredrick Mwasekaga
 */ 
define(function(require) {
	'use strict';
	
	const fingerprint	= require('include/scripts/md5_device_fingerprint');
	const addresses		= require('include/scripts/clientaddress');
	const loader		= require('include/scripts/loader');
	const protocols		= require('include/scripts/chrome/devtools-protocol');
		
	function inIframe() {
		try { return window.self !== window.top; } 
		catch (e) { return true; }
	}
	
	function exception(ex){
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

	function showDialog(icon, title, content){
		var dialogBox = document.createElement('div');
		dialogBox.className 	= "dialog";
		dialogBox.style.width 	= "100%";
		dialogBox.style.height 	= "100%";
		dialogBox.style.zIndex 	= 9414160;
		
		var dialogOverlay = document.createElement('div');
			dialogOverlay.className	= "dialog__overlay";
		
		var dialogContent = document.createElement('div');
			dialogContent.className 		= "dialog__content Shadow White Round";
			dialogContent.style.width 		= "50%";
			dialogContent.style.minWidth	= "290px";
			dialogContent.style.maxWidth	= "560px";
			
			var dialogContentBody = document.createElement('div');
				dialogContentBody.className	= "FlexDisplay FlexColumn";
				
				var dialogHeader = document.createElement('div');
					dialogHeader.className		= "FlexDisplay FlexRow Divider-Bottom";
					dialogHeader.style.width	= "100%";
					dialogHeader.style.height 	= "40px";
					
					var dialogIconHeader = document.createElement('div');
						dialogIconHeader.className		= "FlexDisplay FlexRow";
						dialogIconHeader.style.width	= "24px";
						dialogIconHeader.style.height 	= "100%";
						
						var dialogIcon = document.createElement('span');
							dialogIcon.className			= "dialog__icon";
							dialogIcon.style.whiteSpace		= "nowrap";
							dialogIcon.style.margin			= "10px 8px 8px 8px";
							dialogIcon.style.fontWeight		= "bolder";
							dialogIcon.style.color			= "gray";
							dialogIcon.style.pointerEvents	= "none";
							dialogIcon.innerHTML = icon;
					
					var dialogTitleHeader = document.createElement('div');
						dialogTitleHeader.className		= "FlexDisplay FlexRow Flex";
						dialogTitleHeader.style.width	= "100%";
						dialogTitleHeader.style.height 	= "100%";
						
						var dialogTitle = document.createElement('span');
							dialogTitle.className			= "dialog__title";
							dialogTitle.style.whiteSpace	= "nowrap";
							dialogTitle.style.margin		= "10px 8px 8px 8px";
							dialogTitle.style.fontWeight	= "bolder";
							dialogTitle.style.color			= "gray";
							dialogTitle.style.fontSize		= "14px";
							dialogTitle.style.pointerEvents	= "none";
							dialogTitle.innerHTML = title;
						
					var dialogButton = document.createElement('div');
						dialogButton.className		= "FlexDisplay NonStandard Button Directional";
						dialogButton.style.fontSize	= "24px";
						dialogButton.style.minWidth	= "40px";
						dialogButton.style.maxWidth	= "40px";
						dialogButton.style.height 	= "100%";
						dialogButton.setAttribute("data-dialog-close", '');
						
						var mdiClose = document.createElement('span');
							mdiClose.className			= "mdi mdi-close";
							mdiClose.style.margin		= "6px 0px 0px 0px;";
					
				var dialogBody = document.createElement('div');
					dialogBody.className	= "dialog__body";
					dialogBody.style.width 	= "100%";
					dialogBody.style.height = "auto";
					dialogBody.innerHTML = content;
			
		$(dialogBox).append(dialogOverlay);
		$(dialogBox).append(dialogContent);
		$(dialogContent).append(dialogContentBody);
		$(dialogContentBody).append(dialogHeader);
		
		$(dialogHeader).append(dialogIconHeader);
		$(dialogIconHeader).append(dialogIcon);
		
		$(dialogHeader).append(dialogTitleHeader);
		$(dialogTitleHeader).append(dialogTitle);
		
		$(dialogHeader).append(dialogButton);
		$(dialogButton).append(mdiClose);
		
		$(dialogContentBody).append(dialogBody);
		
		$('body').append(dialogBox);
		
		var dlg = new DialogFx(dialogBox);
		dlg.toggle.bind(dlg);
		dlg.toggle();
		return dlg;
	}
	
	function pageAnimation(foreground, background, textColor, trns = 2){
		var pageAnimationBox = document.createElement('div');
			pageAnimationBox.className 	= "trans-2-open";
			pageAnimationBox.style.width 	= "100%";
			pageAnimationBox.style.height 	= "100%";
			pageAnimationBox.style.zIndex 	= 999999;
			
			var pageAnimationElement1 = document.createElement('div');
				pageAnimationElement1.className	= "element";
				pageAnimationElement1.style.backgroundColor	= foreground;
			var pageAnimationElement2 = document.createElement('div');
				pageAnimationElement2.className	= "element";
				pageAnimationElement2.style.backgroundColor	= foreground;
				
			var pageAnimationElement3 = document.createElement('div');
				pageAnimationElement3.className	= "element";
				pageAnimationElement3.style.backgroundColor	= foreground;
				
				var pageAnimationElement = document.createElement('div');
					pageAnimationElement.className	= "FlexDisplay FlexGrow FlexRow";
					
					var spinnerContainer = document.createElement('div');
						spinnerContainer.className	= "SpinnerContainer FlexHidden FlexDisplay";
						
						var spinner = document.createElement('div');
							spinner.className 		= "Spinner FlexDisplay Flex FlexRow";
							spinner.style.width 	= "100%";
							spinner.style.height 	= "100%";
							
							var rect1 = document.createElement('div');
								rect1.className 			= "Rect1 FlexDisplay FlexGrow";
								rect1.style.backgroundColor	= background;
							var rect2 = document.createElement('div');
								rect2.className 			= "Rect2 FlexDisplay FlexGrow";
								rect2.style.backgroundColor	= background;
							var rect3 = document.createElement('div');
								rect3.className 			= "Rect3 FlexDisplay FlexGrow";
								rect3.style.backgroundColor	= background;
							var rect4 = document.createElement('div');
								rect4.className 			= "Rect4 FlexDisplay FlexGrow";
								rect4.style.backgroundColor	= background;
							var rect5 = document.createElement('div');
								rect5.className 			= "Rect5 FlexDisplay FlexGrow";
								rect5.style.backgroundColor	= background;
								
					var textcontainer = document.createElement('div');
						textcontainer.className			= "FlexDisplay";
						textcontainer.style.width 		= "100%";
						textcontainer.style.position 	= "absolute";
						textcontainer.style.bottom 		= "0px";
						
						var loaderText = document.createElement('span');
							loaderText.className		= "FlexDisplay LoaderText";
							loaderText.style.margin		= "0px auto 0px auto";
							loaderText.style.color 		= textColor;
							loaderText.style.fontSize	= "11px";
				
			var pageAnimationElement4 = document.createElement('div');
				pageAnimationElement4.className	= "element";
				pageAnimationElement4.style.backgroundColor	= foreground;
			var pageAnimationElement5 = document.createElement('div');
				pageAnimationElement5.className	= "element";
				pageAnimationElement5.style.backgroundColor	= foreground;
			
		$(pageAnimationBox).append(pageAnimationElement1);
		$(pageAnimationBox).append(pageAnimationElement2);
		$(pageAnimationBox).append(pageAnimationElement3);
		$(pageAnimationBox).append(pageAnimationElement4);
		$(pageAnimationBox).append(pageAnimationElement5);
		$(pageAnimationElement3).append(pageAnimationElement);
		$(pageAnimationElement).append(spinnerContainer);
		$(spinnerContainer).append(spinner);
		$(spinner).append(rect1);
		$(spinner).append(rect2);
		$(spinner).append(rect3);
		$(spinner).append(rect4);
		$(spinner).append(rect5);
		
		$(pageAnimationElement3).append(textcontainer);
		//$(pageAnimationElement).append(textcontainer);
		$(textcontainer).append(loaderText);
		
		function Close(callback){
			$(spinnerContainer).removeClass("FlexDisplay");
			$(pageAnimationBox).removeClass('trans-'+trns+'-open');
			$(pageAnimationBox).removeClass('trans-'+trns+'-out');
			$(pageAnimationBox).addClass('trans-'+trns+'-out');
			setTimeout(function(){					
				$(pageAnimationBox).css({'display': 'none'});
				$('.transparency').css({'display': 'none'});
				$(loaderText).html("");
				if (callback != undefined && typeof(callback) === "function")callback();	
			},1000);
		}
		
		function Show(callback){
			if(!$(pageAnimationBox).hasClass('trans-2-open')) {
				$(pageAnimationBox).removeClass('trans-'+trns+'-open');
				$(pageAnimationBox).removeClass('trans-'+trns+'-out').css({'display': 'block'});
				$(pageAnimationBox).addClass('trans-'+trns+'-in').delay(650).queue(function()
				{
					$( this ).dequeue();
					$(spinnerContainer).addClass("FlexDisplay");	
					if (callback != undefined && typeof(callback) === "function")callback();					
				});
			}
			else if (callback != undefined && typeof(callback) === "function")callback();
		}
		
		function Text(data){
			$(loaderText).html(data);
		}
		
		return {
			el:pageAnimationBox,
			close:Close,
			show:Show,
			text:Text
		};
	}
	
	function fetchPatient(id){
		return "Patient id: "+id;
	}
	
	return {
		version: '0.0.1',
		inIframe: inIframe,
		exception: exception,
		fingerprint: fingerprint,
		protocols: protocols,
		addresses: addresses,
		loader: loader,
		showDialog:showDialog,
		require:require,
		pageAnimation:pageAnimation,
		fetchPatient:fetchPatient
	};
});