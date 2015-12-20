var promisify = require('promisify-methods')

var seconds = 1000
var minutes = 60*seconds
var hours = 60*minutes
var days = 60*hours

var memoryCache = {
	storage: {},
	write: function(key, calculateValue, expiresIn) {
		calculateValue = calculateValue || function(){ return null };
		expiresIn = expiresIn || 8*hours;
		this.storage[key] = {
			value: calculateValue(), 
			expires: new Date(Math.abs(new Date() - -expiresIn))
		};
	},
	read: function(key, missedSet, expiresIn) {
		if ((!this.storage[key]) || (this.storage[key].expires < new Date())) this.write(key, missedSet, expiresIn);
		return this.storage[key].value;
	}
};

promisify(memoryCache);

module.exports = memoryCache;