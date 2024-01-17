const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);

let data = '';
readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => console.log(data));
readableStream.on('error', (error) => console.log('Error', error.message));

/*fs.readFile(path.join(__dirname, 'text.txt'), 'utf8', (err, data) => {
  if (err) console.log('Error', error.message);
  console.log(data);
})

process.on('uncaughtException', (error) => {
  console.error(`There was an uncaught error: ${error}`);
  process.exit(1);
});*/