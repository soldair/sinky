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

const fifo = process.argv[2]
const request = require('teeny-request').teenyRequest
const { workerRead, workerWrite } = require('./')

workerRead((url) => {
  console.log(url)
  request({uri:url},(err,res,body)=>{
    console.log(err,res)
    workerWrite(fifo, body)
  })
})