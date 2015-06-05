var SHLOGLEVEL = {
	info: 		0x1,
	debug: 		0x2,
	error: 		0x4,
	log: 		0x8
},shLogger = function(level){
	this.level = shUtility.reduce(shUtility.map(level.split(/ /),function(e){
			return SHLOGLEVEL[e];
		}),function(total,e){
		return total | e; 
	},0);
},eeeee=Array.prototype.slice;
shLogger.prototype = {
	log:function(type,args){
		var msg = args.join('');
		if (SHLOGLEVEL[type] & this.level){
			console[type](msg);
		}
	},
	debug:function(){
		this.log('debug',eeeee.call(arguments,0));
	},
	info:function(){
		this.log('info',eeeee.call(arguments,0));
	},
	error:function(){
		this.log('log',eeeee.call(arguments,0));
	}
}; 

