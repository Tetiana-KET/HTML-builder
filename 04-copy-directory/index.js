const path = require('path');
const fs = require('fs').promises;

const sourcePath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'files-copy');

async function copyFolder(from = sourcePath, to = targetPath) {
  try {
    await fs.access(to);
    await fs.rm(to, {recursive: true});
  } catch (err) {}

  await fs.mkdir(to, { recursive: true });
  const files = await fs.readdir(from, {withFileTypes: true});

  await Promise.all(files.map(async (file) => {
    const sourceFilePath = path.join(from, file.name);
    const targetFilePath = path.join(to, file.name);

    if (file.isFile()) {
      await fs.copyFile(sourceFilePath, targetFilePath);
    } else if (file.isDirectory()) {
      await copyFolder(sourceFilePath, targetFilePath);
    }
  }));
}
copyFolder();