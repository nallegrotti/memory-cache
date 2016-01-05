var expect = require('chai').expect,
    cache = require('../memory-cache'),
    timestamp = Date.now();

describe('Cache', function(){
	it('should read from cached values', function(){
		cache.storage.exists = {value:1234, expires: timestamp + 2800000};
		var execution = 0;
		cache.read('exists', function(){ execution++ })
			.then(function(d){
				expect(execution).to.be.equals(0);
				expect(d).to.be.equals(1234);
			})
	});

	it("should execute missed function if there's no cached value", function(){
		var execution = 0;
		cache.read('not_exists', function(){execution++; return 1234;}).then(function(){
			expect(execution).to.be.equals(1);
		});
	});

	it("should execute missed function if cached key is expired", function(){
		var execution = 0;
		cache.storage.expired = {value: 1234, expires: timestamp - 360000};
		cache.read('expired', function(){execution++; return 321;}).then(function(d){
			expect(execution).to.be.equals(1);
			expect(d).to.be.equals(321);
		})
	});

	it("should set parametrized expiration", function(){
		cache.read('not_exists_custom_expire', function(){return 222;}, 7200000).then(function(){
			expect(cache.storage.not_exists_custom_expire.expires).to.be.above(3600000)
				.and.below(timestamp + 7200001);
		})
	});

	it('should set 8 hours of default expiration for new keys', function(){
		cache.write('forced', function(){return 'mock';}).then(function(){
			expect(cache.storage.forced.expires).to.be.above(25200000)
				.and.below(timestamp + 28800001);
		})
	})
})