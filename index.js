const express = require('express');
const yargs = require('yargs');

const args = yargs
  .usage('Usage: node $0 [options]')
  .help('help')
  .alias('help', 'h')
  .alias('version', 'v')
  .example('node $0 index.js --interval=num --limit=num')
  .option('interval', {
      alias: 'i',
      describe: 'Interval of output to the console of the current time',
      demandOption: true,
      default: 1
  })
  .option('limit', {
      alias: 'l',
      describe: 'The time (seconds) after which the console output will stop',
      default: 20
  })
  .epilog('My first http-server implementation')
  .argv

const app = express()

const LIMIT = args.limit * 1000;
const INTERVAL = args.interval * 1000;
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