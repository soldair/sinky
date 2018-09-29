# sinky

sink your ships or sync fetch your files. yarrr

run async node apis like `http` as sync

```js
const path = require('path')
const sinky = require('sinky')
const workerPath = path.join(__dirname, 'example-worker.js')
const channelPath = path.join(__dirname, 'example-fifo')
let requestFile = sinky(channelPath, workerPath)

// look ma no await!
let contents = requestFile('https://unpkg.com/yargs@12.0.2/README.md')
console.log(contents+'')
```

worker.js

```js
const fifo = process.argv[2]
const request = require('teeny-request').teenyRequest
const { workerRead, workerWrite } = require('sinky')

workerRead((url) => {
  request({uri:url},(err,res,body)=>{
    workerWrite(fifo, body)
  })
})
```

While this doesn't have any native deps, this uses `mkfifo` to create a named pipe.
Until i learn how to do the same on windows with `\\.\pipe\named-pipes` this only works on systems with `mkfifo`

## background

This is mostly for fun. I wanted to play with loading all of my `require` dependencies from redis etc.

## benchmarks.

In a worker that does nothing but echo back this channel adds about `0.04` ms overhead. about the same as shelling out to `curl`

This is an extremely unscientific benchmark.

The first invocation spins up another node process which takes as long as it does to start your worker app in node.


## notes

This is not an official google product
