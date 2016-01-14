# memory-cache
Really simple cache in memory for node.js
 * No concurrence
 * No write
 * No deletes
 * Only Gets and Expiration

##How to use:

```javascript
let cache = require('in-memory-cache')
let executions = 0
let time_consuming = () => { executions ++; return 'calculated value' }

await cache.read('some_key', time_consuming)
.then((value) => {
	console.log(`Here you have it: ${value}`)
})
await cache.read('some_key', time_consuming)
.then((value) => {
	console.log(`Here you have it again: ${value}`)
})

console.log(`Calculated ${executions} times`)

executions
```

If 'some_key' is present in cache the function y the second parameter doesn't execute. The function is where you put your time consuming process that you want to be cached. 

CI status: [![Circle CI](https://circleci.com/gh/nallegrotti/memory-cache/tree/master.svg?style=svg)](https://circleci.com/gh/nallegrotti/memory-cache/tree/master)
