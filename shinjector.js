var shUtility = {
	map:function(arr,fn){
		var a = []; 
		for(var key in arr){
			a[key] = fn(arr[key]); 
		}
		return a; 
	},
	reduce:function(arr,fn,start){
		var a = start; 
		for(var key in arr){
			a = fn(a,arr[key]); 
		}
		return a;
	},
	isString:function(t){
		return Object.prototype.toString.call(t) === '[object String]';
	},
	isArray:function(t){
		return Object.prototype.toString.call(t) === '[object Array]';
	},
	isObject:function(t){
		return Object.prototype.toString.call(t) === '[object Object]';
	},
	isFunction:function(t){
		return Object.prototype.toString.call(t) === '[object Function]'; 
	},
	forEach:function(arr,fn){
		for(var key in arr){
			fn(arr[key],key); 
		}
	}
};
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


var shInjector = function shInjector(strict,logger){
	this.injectables = {};
	this.components = {}; 
	this.logger = logger || new shLogger('info');
	this.injectables.logger = this.logger; 
	this.strict = strict || false;
	this.stack = [];
};

shInjector.prototype = {
	register:function(name,generator){
		var n = shUtility.isString(name)?name:((name.name)?name.name:((shUtility.isFunction(generator) && generator.name)?generator.name:(shUtility.isArray(name)?(name[name.length-1].name):null))),
			fn = generator || name;
		this.logger.info('Component name: '+n);
		this.logger.debug('Component generator: '+fn);
		if (!shUtility.isString(n)){
			this.logger.error('Component has no name',n);
			throw new Error('Component has no name'); 
		}
		if (!fn){
			this.logger.error('No injectable provided');
			throw new Error('No injectable provided'); 
		}
		if (!shUtility.isFunction(fn) && !shUtility.isArray(fn)){
			this.injectables[name] = fn; 
		}else {
			this.components[n] = fn;
		}
		return this;
	},
	get:function(name){
		var i;
		if ((i = this.stack.indexOf(name)) != -1){
			var z = this.stack.slice(i).join(' -> ');
			this.logger.error('Circular dependency '+z+' -> '+name);
			throw new Error('Circular dependency '+z+' -> '+name);
		}
		this.stack.push(name); 
		if (this.injectables[name]){
			this.stack.pop();
			return this.injectables[name]; 
		}else if (this.components[name]){
			var deps = this.getDependencies(this.components[name],name),
				comp = this.components[name],
				fn = shUtility.isArray(comp)?comp[comp.length-1]:comp;
			this.stack.pop();
			return (this.injectables[name] = fn.apply(this,deps)); 
		}else {
			this.logger.error('Component `'+name+'` is not registered.');
			throw new Error('Component `'+name+'` is not registered.');
		}

	},
	getDependencies:function(comp,name){
		var fn,deps =[],fnName,t,self=this,depsObjs=[],params; 
		if (shUtility.isArray(comp)){
			deps = comp.slice(0,comp.length-1);
			fn = comp[comp.length-1]; 
			fnName = name; 
		}else {
			fnName = name; 
			t = comp.toString();
			params = t.match(/\(([\S]*?)\)/); 
			deps = [];
			if (params && params.length > 0 &&
				params[1] !== ''){
				deps = params[1].split(/,/); 
			}
		}
		if (deps.length > 0){
			shUtility.forEach(deps,function(e,v){
				try{
					depsObjs.push(self.get(e));
				}catch(err){
					if (self.strict){
						throw err;
					}else {
						self.logger.error('Component `'+fnName+'` could not be instanitated because one of its dependencies could not be found: '+err.message);
						
					}
				}
			});
		}
		return depsObjs;
	}

};