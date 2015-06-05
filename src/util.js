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