const { optimize } = require('svgo');
const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '..', 'public');
const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

(async () => {
  for (const file of files) {
    const inPath = path.join(svgDir, file);
    const content = fs.readFileSync(inPath, 'utf-8');
    
    try {
      const result = optimize(content, {
        multipass: true,
        plugins: [
          'preset-default',
          { name: 'removeViewBox', active: false },
          { name: 'removeDimensions', active: true },
        ],
      });
      
      fs.writeFileSync(inPath, result.data);
      console.log('Minified', file);
    } catch (err) {
      console.error('Failed to minify', file, err);
    }
  }
})();
