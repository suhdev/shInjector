var SH_LOGGER_LEVELS = {
	info: 		0x00001,
	debug: 		0x00002,
	error: 		0x00004,
	log: 		0x00008
}; 
var shLogger = function(level){
	this.level = shUtility.reduce(shUtility.map(level.split(/ /),function(e){
			return SH_LOGGER_LEVELS[e];
		}),function(total,e){
		return total | e; 
	},0);
};

shLogger.prototype = {
	log:function(type,args){
		var msg = args.join('');
		if (SH_LOGGER_LEVELS[type] & this.level){
			console[type](msg);
		}
	},
	debug:function(){
		this.log('debug',Array.prototype.slice.call(arguments,0));
	},
	info:function(){
		this.log('info',Array.prototype.slice.call(arguments,0));
	},
	error:function(){
		this.log('log',Array.prototype.slice.call(arguments,0));
	}
}; 

