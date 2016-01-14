# memory-cache
Really simple cache in memory for node.js
 * No concurrence
 * No write
 * No deletes
 * Only Gets and Expiration

##How to use:

```javascript
cache = require('in-memory-cache');
cache.get('some_key', function(){ 
  return 'calculated value'; 
}).then(function(value){ 
  console.log("Here you have it: %s", value); 
});
```

If 'some_key' is present in cache the function y the second parameter doesn't execute. The function is where you put your time consuming process that you want to be cached. 

CI status: [![Circle CI](https://circleci.com/gh/nallegrotti/memory-cache/tree/master.svg?style=svg)](https://circleci.com/gh/nallegrotti/memory-cache/tree/master)
