const express = require('express');
const yargs = require('yargs');
require('dotenv').config()

const args = yargs
  .usage('Usage: [env variables] node $0 [options]')
  .help('help')
  .alias('help', 'h')
  .alias('version', 'v')
  .example('APP_LIMIT=2 APP_INTERVAL=30 npm run start')
  .env('APP')
  .option('l', {
    alias: 'INTERVAL',
    describe: 'Interval of output to the console of the current time',
    demandOption: true,
    default: 1
  })
  .option('i', {
    alias: 'LIMIT',
    describe: 'The time (seconds) after which the console output will stop',
    default: 20
  })
  .epilog('My first http-server implementation')
  .argv

const app = express()

const LIMIT = process.env.APP_LIMIT * 1000;
const INTERVAL = process.env.APP_INTERVAL * 1000;
const PORT = 3000;

let connections = [];

app.get('/date', (req, res, next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    connections.push(res);
})

let startTime = new Date().getTime();
let endTime = new Date(startTime + LIMIT);
console.log('\n');

setTimeout(function run() {
    let currentDate = new Date();
    let time = getTime();
    let date = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
    console.log(getTime());
    if (currentDate.getTime() > endTime) {
        connections.map(res => {
            res.write(`\n END ${date} ${time} \n`);
            res.end();
        })
        connections = [];
        return;
    }
    connections.map((res, i) => {
        res.write(`\n User ${i}. Time: ${time}`);
    })
    setTimeout(run, INTERVAL)
}, 1000)

//run server
let server = app.listen(PORT, () => {
    console.log(`Server starts running on port ${PORT} with LIMIT: ${args.limit} seconds, INTERVAL: ${args.interval} seconds`)
})

function getTime() {
  let currentDate = new Date();
  return `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
}