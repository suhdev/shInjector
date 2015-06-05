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