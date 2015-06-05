# shInjector

A simple dependency injection class for JavaScript apps. Supports both named parameters and Angular strict injection model (using arrays). The module has no dependencies, and can be intergrated with any JavaScript application. There will also be a NodeJS version of the injector to be released soon.  

## Usage

Just include the file `shinject.min.js` in your html files. 
```html

<script type="text/javascript" src="PATH_TO_/shinjector.min.js"></script>

```

Then use it in your code: 

```javascript

var injector = new shInjector();  
injector.register('testServ',function testServ(logger,serv1){
	return {
		testServ:function(){
			return 'testserv'; 
		}
	};
});

injector.register('serv1',function testServ2(logger,testServ){
	return {
		testServ2:function(){
			return 'testserv2'; 
		}
	};
});

injector.register('servz',['logger','serv1','testServ',function testServx(logger,serv1,serv2){
	return {
		testServZ:function(){
			return serv1.testServ2()+" "+serv2.testServ(); 
		}
	};
}]);

//then to get an instance just use 
//injector.get('__NAME__OF__ENTITY__')
var servz = injector.get('servz');
servz.testServZ(); 

```


Suhail Abood &copy; 2015 