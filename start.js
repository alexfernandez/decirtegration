'use strict';

const http = require('http');
const childProcess = require('child_process');

function start() {
  const server = http.createServer((request, response) => {
    console.log('received request for %s', request.url);
    response.write('Received request for ' + request.url);
    run((error, output) => {
      if (error) {
        return response.end('Failed: ' + error);
      }
      return response.end('Worked: ' + output);
    });
  });
  server.listen(8080);
}

function run(callback) {
  childProcess.exec('cd ../decirculo && git pull && npm test', (error, out) => {
    if (error) return callback('integration failed: ' + error);
    else return callback(null, 'integration OK: ' + out);
  })
}

start();

