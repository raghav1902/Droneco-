const fs = require('fs');
const path = require('path');

const srcModulesDir = path.join(__dirname, 'src', 'modules');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      content = content.replace(/\.\.\/middleware\//g, '../../../middleware/');
      content = content.replace(/\.\.\/utils\//g, '../../../utils/');
      content = content.replace(/\.\.\/validators\//g, '../../../validators/');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated relative middleware/utils imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(srcModulesDir);
console.log('Fixed middleware/utils imports');
