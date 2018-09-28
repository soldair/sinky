const path = require('path')
const syncChannel = require('./')
const workerPath = path.join(__dirname, '/example-worker.js')
const channelPath = path.join(__dirname, 'example-fifo')
let requestFile = syncChannel(channelPath, workerPath)

// look ma no await!
let contents = requestFile('https://unpkg.com/yargs@12.0.2/README.md')
console.log(contents+'')