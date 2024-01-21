const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const templateDir = path.join(__dirname, 'template.html');
const assets = path.join(__dirname, 'assets');
const targetAssets = path.join(targetDir, 'assets');
const targetHtmlDir = path.join(__dirname, 'project-dist', 'index.html');
const targetCss = path.join(__dirname, 'project-dist', 'style.css');

//create folder
fs.mkdir(targetDir, { recursive: true }, (err) => {
  if (err) throw err;
});

//create html
let content = '';

fs.readFile(templateDir, 'utf-8', (err, data) => {
  if (err) throw err;
  content += data;

  fs.readdir(componentsDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    let targetFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.html',
    );

    if (targetFiles.length === 0) {
      fs.writeFile(targetHtmlDir, content, (err) => {
        if (err) throw err;
      });
    } else {
      targetFiles.forEach((file) => {
        fs.readFile(
          path.join(componentsDir, file.name),
          'utf-8',
          (err, data) => {
            if (err) throw err;

            let sample = '{{' + path.parse(file.name).name + '}}';
            content = content.replaceAll(sample, data);

            fs.writeFile(targetHtmlDir, content, (err) => {
              if (err) throw err;
            });
          },
        );
      });
    }
  });
});

// merge styles

const writeableStream = fs.createWriteStream(targetCss, 'utf8');

fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(stylesDir, file.name);
    const fileExt = path.extname(filePath);

    if (file.isFile() && fileExt === '.css') {
      fs.createReadStream(filePath, 'utf8').pipe(writeableStream);
    }
  });
});

//copy assets


async function copyFiles(from = assets, copyTo = targetAssets) {
  await fs.promises.rm(copyTo, { recursive: true, force: true });

  fs.mkdir(copyTo, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(from, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const sourceFilePath = path.join(from, file.name);
      const targetFilePath = path.join(copyTo, file.name);

      if (file.isFile()) {
        fs.copyFile(sourceFilePath, targetFilePath, (err) => {
            if (err) throw err;
          },
        );
      } else if (file.isDirectory()) {
        fs.mkdir(targetFilePath, { recursive: true }, (err) => {
          if (err) throw err;
        });
        copyFiles(sourceFilePath, targetFilePath);
      }
    });
  });
}
copyFiles();