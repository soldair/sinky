/* global describe, it, beforeEach */
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
const path = require('path')
const assert = require('assert')
const syncChannel = require('../')

describe('sync-channel', () => {
  const workerPath = path.join(__dirname, '..', '/worker-echo.js')
  const fifoPath = path.join(__dirname, 'test-fifo')

  beforeEach(() => {
    fs.unlinkSync(fifoPath)
  })

  it('can call a worker', (done) => {
    let syncAction = syncChannel(fifoPath, workerPath)
    let value = Date.now()
    let result = syncAction(value)

    assert.strictEqual('' + value, result + '')
    done()
  })
})
