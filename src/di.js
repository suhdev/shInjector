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
						
					}
				}
			});
		}
		return depsObjs;
	}

};