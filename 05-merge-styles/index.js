const fs = require('fs');
const path = require('path');

const sourceFolderDir = path.join(__dirname, 'styles');
const targetDir = path.join(__dirname, 'project-dist', 'bundle.css');
const writeableStream = fs.createWriteStream(targetDir, 'utf8');
fs.readdir(sourceFolderDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(sourceFolderDir, file.name);
    const fileExt = path.parse(filePath).ext.slice(1);

    if (file.isFile() && fileExt === 'css') {
      fs.createReadStream(filePath, 'utf8').pipe(writeableStream);
    }
  });
});
