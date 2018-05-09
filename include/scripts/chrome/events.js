define(function(require) {
	'use strict';
	
	const Emitter 	= require('include/scripts/emitter');
	
	class EventEmitter {
		constructor() {
			this.signals = new Emitter();
		}
		
		listenersCount(signal) {
			return this.signals.listenersCount(signal);
		}
		
		on(signal, slot, scope) {
			this.signals.on(signal, slot, scope);
		}
		
		off(signal, slot, scope) {
			this.signals.off(signal, slot, scope);
		}
		
		once(signal, slot, scope) {
			this.signals.once(signal, slot, scope);
		}
		
		emit(signal,sender,data) {
			this.signals.emit(signal,sender,data);
		}
		
		connect(slots, scope) {
			this.signals.connect(slots, scope);
		}
		
		disconnect(slots, scope) {
			this.signals.disconnect(slots, scope);
		}		
	}
	
	return EventEmitter;
});