const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'public', 'images');
const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

(async () => {
  for (const file of files) {
    const inPath = path.join(srcDir, file);
    const outName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outPath = path.join(srcDir, outName);
    try {
      await sharp(inPath)
        .webp({ quality: 80 })
        .toFile(outPath);
      console.log('Converted', file, '->', outName);
    } catch (err) {
      console.error('Failed to convert', file, err);
    }
  }
})();
