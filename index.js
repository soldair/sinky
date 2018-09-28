// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const fs = require('fs')
const { spawn, execFileSync } = require('child_process')
const split2 = require('split2')

let syncChannel = new Map()

module.exports = (syncChannelName, file, options) => {
  if (syncChannel.has(syncChannelName)) {
    return syncChannel.get(syncChannelName)
  }

  let currentAction
  options = Object.assign(options || {}, { workerData: { fifo: syncChannelName } })

  let worker = spawn(process.execPath, [file, syncChannelName], { stdio: ['pipe', 'inherit', 'inherit'] })
  worker.unref()
  // worker.on('error', reject);
  worker.on('close', (code) => {
    if (code !== 0) {
      // this will likely happen out of band.
      // if the worker crashes while the parent is waiting it'll be kinda stuck forever.
      throw new Error(`Worker stopped with exit code ${code}. last processed ${currentAction}`)
    }

    syncChannel.delete(syncChannelName)
  })

  try {
    if(!fs.existsSync(syncChannelName)){
      // todo: named pipe on windows
      execFileSync('mkfifo', [syncChannelName])
    }
  } catch (e) {
    // ignore file exists errors.
    if (e.message.indexOf('File exists') === -1) {
      throw e
    }
  }

  let syncHandler = (action) => {
    currentAction = action
    worker.stdin.write(JSON.stringify(action) + '\n')
    return fs.readFileSync(syncChannelName)
  }

  syncHandler.worker = worker

  syncChannel.set(syncChannelName, syncHandler)

  return syncHandler
}

module.exports.workerRead = (handler) => {
  process.stdin.pipe(split2()).on('data', (s)=>{
    handler(gentleJson(s)||s)
  })
}

module.exports.workerWrite = (fifo, data) => {
  // with flag set as 'a+' the data channel hangs after about 729 events.
  // w etc dont work at all because node tries to fseek in a fifo XD
  fs.writeFileSync(fifo, data, { flag: 'a' })
}

function gentleJson(s){
  try{
    return JSON.parse(s)
  } catch(e){}
}
