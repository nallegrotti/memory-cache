var expect = require('chai').expect,
    cache = require('../memory-cache'),
    timestamp = Date.now();

var seconds = 1000, 
	minutes = 60*seconds, 
	hours = 60*minutes, 
	days = 60*hours;

describe('Cache', function(){
	it('should read from cached values', function(){
		cache.write('exists', function(){return 1234}, 8*hours).then(function(){
			var execution = 0;
			cache.read('exists', function(){ execution++ })
				.then(function(d){
					expect(execution).to.be.equals(0);
					expect(d).to.be.equals(1234);
				})
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
		cache.write('expired', function(){return 1234}, -6*minutes).then(function(){
			cache.read('expired', function(){execution++; return 321;}).then(function(d){
				expect(execution).to.be.equals(1);
				expect(d).to.be.equals(321);
			})
		})
	});

	it("should set parametrized expiration", function(){
		cache.read('not_exists_custom_expire', function(){return 222;}, 2*hours).then(function(){
			expect(cache.storage.not_exists_custom_expire.expires).to.be.above(1*hours)
				.and.below(timestamp + 2*hours + 1*seconds);
		})
	});

	it('should set 8 hours of default expiration for new keys', function(){
		cache.write('forced', function(){return 'mock';}).then(function(){
			expect(cache.storage.forced.expires).to.be.above(8*hours)
				.and.below(timestamp + 8*hours + 1*seconds);
		})
	})
})