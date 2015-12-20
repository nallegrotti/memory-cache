var expect = require('chai').expect
var cache = require('../memory-cache');

var seconds = 1000
var minutes = 60*seconds
var hours = 60*minutes
var days = 60*hours

describe('Cache', function(){
	it('should read from cached values', function(){
		cache.storage.exists = {value:1234, expires: new Date() - -10*days};
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
		cache.storage.expired = {value: 1234, expires: new Date() - 2*minutes};
		cache.read('expired', function(){execution++; return 321;}).then(function(d){
			expect(execution).to.be.equals(1);
			expect(d).to.be.equals(321);
		})
	});

	it("should set parametrized expiration", function(){
		cache.read('not_exists_custom_expire', function(){return 222;}, 2*hours).then(function(){
			expect(cache.storage.not_exists_custom_expire.expires).to.be.above(new Date(new Date() - -1*hours))
				.and.below(new Date(new Date() - -2*hours + 1*seconds));
		})
	});

	it('should set 8 hours of default expiration for new keys', function(){
		cache.write('forced', function(){return 'mock';}).then(function(){
			expect(cache.storage.forced.expires).to.be.above(new Date(new Date() - -7*hours))
				.and.below(new Date(new Date() - -8*hours + 1*seconds));
		})
	})
})