describe("injector test suite", function() {
	var injector; 
	beforeEach(function() {
		injector = new shInjector(); 
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

	});

	it("should have the default methods", function() {
		expect(injector.get).toBeDefined();
		expect(injector.register).toBeDefined();
		expect(injector.getDependencies).toBeDefined();

	});
	
	it("should retrieve item using get", function() {
		expect(injector.get('servz')).toBeDefined();
		expect(injector.get('servz').testServZ).toBeDefined();
		expect(injector.get('servz').testServZ()).toEqual('testserv2 testserv');
	});



});