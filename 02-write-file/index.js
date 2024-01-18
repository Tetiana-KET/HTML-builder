const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;
const writableStream = fs.createWriteStream(path.join(__dirname, 'destination.txt'), 'utf-8');

stdout.write('Hello!, Enter your message:\n');

stdin.on('data', (data) => {
  if (data.toString().toLowerCase().trim() === 'exit') {
    process.exit();
  } else {
    writableStream.write(data, 'utf-8');
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('Looking forward to see you again! Bye!')
})