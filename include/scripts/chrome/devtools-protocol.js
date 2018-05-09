/*!
 * ePlug 0.0.1
 * Copyright © 2018 Fredrick Mwasekaga
 * Resource : https://chromedevtools.github.io/devtools-protocol/tot
 */ 
define(function(require) {
	'use strict';
	
	const devtools	= require('include/scripts/chrome/devtools');

	return {
		version: '0.0.1',
		settings :require('include/scripts/chrome/defaults'),
		API : require('include/scripts/chrome/chrome'),
		listTabs : devtools.List,
		spawnTab : devtools.New,
		closeTab : devtools.Close,
		getProtocol : devtools.Protocol,
		activate : devtools.Activate,
		getVersion : devtools.ChromeVersion
	};
});