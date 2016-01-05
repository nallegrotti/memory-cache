var promisify = require('promisify-methods'),
    timestamp = Date.now();

var memoryCache = {
	storage: {},
	write: function(key, calculateValue, expiresIn) {
		calculateValue = calculateValue || function(){ return null };
		expiresIn = expiresIn || timestamp + 28800000;
		this.storage[key] = {
			value: calculateValue(), 
			expires: expiresIn
		};
	},
	read: function(key, missedSet, expiresIn) {
		if ((!this.storage[key]) || (this.storage[key].expires < new Date())) this.write(key, missedSet, expiresIn);
		    return this.storage[key].value;
	}
};

promisify(memoryCache);

module.exports = memoryCache;