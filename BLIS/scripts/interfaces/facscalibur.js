/*!
 * ePlug 0.0.1
 * Copyright © 2018 Fredrick Mwasekaga
 */ 
define(function(require) {
	'use strict';
	
	function connect(){
		return "ok";
	}
	
	function closeInterface(){
		
	}
	
	return {
		version: '0.0.2',
		connect : connect,
		disconnect : closeInterface
	};
});