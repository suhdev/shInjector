(function(){
	var c = Object.prototype.toString,
	d = function isSth(o,e){
		return c.call(o) === '[object '+e+']';
	},shUtility = {
	map:function(arr,fn){
		var a = [],k; 
		for(k in arr){
			a[k] = fn(arr[k]); 
		}
		return a; 
	},
	reduce:function(arr,fn,s){
		var a = s,k; 
		for(k in arr){
			a = fn(a,arr[k]); 
		}
		return a;
	},
	isString:function(t){
		return d(t,'String');
	},
	isArray:function(t){
		return d(t,'Array');
	},
	isObject:function(t){
		return d(t,'Object');
	},
	isFunction:function(t){
		return d(t,'Function');
	},
	forEach:function(arr,fn){
		for(var k in arr){
			fn(arr[k],k); 
		}
	}
};
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


var shInjector = function shInjector(s,logger){
	//injectables object
	this.inj = {};
	//instantiated components 
	this.cpts = {}; 
	this.l = logger || new shLogger('info');
	this.inj.logger = this.l; 
	//strict flag
	this.s = s || false;
	this.stack = [];
};

shInjector.prototype = {
	register:function(name,generator){
		var n = shUtility.isString(name)?name:((name.name)?name.name:((shUtility.isFunction(generator) && generator.name)?generator.name:(shUtility.isArray(name)?(name[name.length-1].name):null))),
			fn = generator || name;
		this.l.info('Component name: '+n);
		this.l.debug('Component generator: '+fn);
		if (!shUtility.isString(n)){
			this.l.error('Component has no name',n);
			throw new Error('Component has no name'); 
		}
		if (!fn){
			this.l.error('No injectable provided');
			throw new Error('No injectable provided'); 
		}
		if (!shUtility.isFunction(fn) && !shUtility.isArray(fn)){
			this.inj[name] = fn; 
		}else {
			this.cpts[n] = fn;
		}
		return this;
	},
	get:function(name){
		var i;
		if ((i = this.stack.indexOf(name)) != -1){
			var z = this.stack.slice(i).join(' -> ');
			this.l.error('Circular dependency '+z+' -> '+name);
			throw new Error('Circular dependency '+z+' -> '+name);
		}
		this.stack.push(name); 
		if (this.inj[name]){
			this.stack.pop();
			return this.inj[name]; 
		}else if (this.cpts[name]){
			var deps = this.getDependencies(this.cpts[name],name),
				comp = this.cpts[name],
				fn = shUtility.isArray(comp)?comp[comp.length-1]:comp;
			this.stack.pop();
			return (this.inj[name] = fn.apply(this,deps)); 
		}else {
			this.l.error('Component `'+name+'` is not registered.');
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
					if (self.s){
						throw err;
					}else {
						self.l.error('Component `'+fnName+'` could not be instanitated because one of its dependencies could not be found: '+err.message);
						console.log(err);
					}
				}
			});
		}
		return depsObjs;
	}
  var objectTypes = {
    'function': true,
    'object': true
  };
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    root.shInjector = shInjector;
    define(function() {
      return shInjector;
    });
  } else if (freeExports && freeModule) {
    if (moduleExports) {
      (freeModule.exports = shInjector).shInjector = shInjector;
    } else {
      freeExports.shInjector = shInjector;
    }
  } else {
    root.shInjector = shInjector;
  }
})();