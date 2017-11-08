'use strict';

const http = require('http');
const api = require('./api.js');
const childProcess = require('child_process');

function start() {
  const server = http.createServer((request, response) => {
    console.log('received request for %s', request.url);
    response.write('Received request for ' + request.url);
    run((error, output) => {
      if (error) {
        return response.end('Failed: ' + error);
      }
      response.write('Worked: ' + output);
      const instance = {PublicIpAddress: '54.154.100.15'};
      api.deploy([instance], 'projects/decirculo', (error, out) => {
        if (error) {
          response.end('Deployment KO: ' + error);
          return console.error('KO: %s', error);
        }
        response.end('Deployment OK: ' + out);
        console.log('OK: %s', out);
      });
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

