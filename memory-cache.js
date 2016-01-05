var promisify = require('promisify-methods');

var seconds = 1000, 
	minutes = 60*seconds, 
	hours = 60*minutes, 
	days = 60*hours;

var memoryCache = {
	storage: {},
	write: function(key, calculateValue, expiresInMillis) {
		calculateValue = calculateValue || function(){ return null };
		expiresInMillis = expiresInMillis || 8*hours;
		this.storage[key] = {
			value: calculateValue(), 
			expires: Date.now() + expiresInMillis
		};
	},
	read: function(key, missedSet, expiresInMillis) {
		if ((!this.storage[key]) || (this.storage[key].expires < Date.now())) {
			this.write(key, missedSet, expiresInMillis);	
		}
		
		return this.storage[key].value;
	}
};

promisify(memoryCache);

module.exports = memoryCache;