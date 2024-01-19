const fs = require('fs');
const path = require('path');

fs.readdir(path.resolve(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err.message)
  } else {

    return files.filter((item) => item.isFile()).forEach((file) => {
      const filePath = path.join(file.path, file.name);
      const fileExt = path.parse(filePath).ext.slice(1);
      const fileName = path.parse(filePath).name;

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(err.message);
        }
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      });
    });
  }
})